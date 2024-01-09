"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/Loading";
import PaginationControls from "@/components/PaginationControls";

interface PokemonItem {
  name: string;
  id: number;
  info: any;
}

interface MonsterObjectItem {
  name: string;
  id: number;
  types: string[];
}

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter()
  
  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "6";

  const [pokemonData, setPokemonData] = useState<PokemonItem[]>([]);
  const [filteredData, setFilteredData] = useState<MonsterObjectItem[]>([]);
  const [selectedNameFilter, setSelectedNameFilter] = useState<string>("None");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("None");
  const [loading, setLoading] = useState<boolean>(false);

  const memoizedInitialData = useMemo(() => {
    return restructureMonsterData(pokemonData);
  }, [pokemonData]);

  async function fetchPokemonData() {
    const res = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query getFirstGenPokemon {
          gen1_species: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}, order_by: {id: asc}) {
            name
            id
            info: pokemon_v2_pokemons_aggregate(limit: 1) {
              nodes {
                types: pokemon_v2_pokemontypes {
                  type: pokemon_v2_type {
                    name
                  }
                }
                pokemon_species_id
              }
            }
            evolution_chain_id
          }
        }
              `,
      }),
    });
    const data = await res.json();

    const {
      gen1_species: pokemonData,
    }: {
      gen1_species: PokemonItem[];
    } = data.data;

    setPokemonData(pokemonData);
    setLoading(false);
  }

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const displayData =
    //filter conditions
    selectedNameFilter === "None" && selectedTypeFilter === "None"
      ? memoizedInitialData
      : filteredData;

  const entries = displayData.slice(start, end);

  useEffect(() => {
    setLoading(true);
    fetchPokemonData();
  }, []);

  //rerenders for filters
  useEffect(() => {}, [selectedNameFilter, selectedTypeFilter]);

  function restructureMonsterData(data: PokemonItem[]) {
    return data.map((item: any) => {
      let monsterObj: any = {};
      monsterObj["name"] = item.name;
      monsterObj["id"] = item.id;
      let monsterTypes: string[] = [];
      item.info.nodes[0].types.forEach((item: any) => {
        monsterTypes.push(item.type.name);
      });
      monsterObj["types"] = monsterTypes;
      return monsterObj;
    });
  }

  function filterByNameHandle(name: string) {
    setLoading(true)
    const sanitizedName = name.toLowerCase();
    setFilteredData([]);
    setSelectedTypeFilter("None");
    setSelectedNameFilter(sanitizedName);
    const filteredData = memoizedInitialData.filter(
      (item: MonsterObjectItem) => {
        return item.name === sanitizedName;
      }
    );
    setFilteredData(filteredData);
    //to reset page to 1 for filtered results
    router.push(`/?page=1&per_page=${per_page}`)
    setLoading(false)
  }


  function filterByTypeHandle(type: string) {
    setLoading(true)
    const sanitizedType = type.toLowerCase();
    setFilteredData([]);
    setSelectedNameFilter("None");
    setSelectedNameFilter(sanitizedType);
    const filteredData = memoizedInitialData.filter(
      (item: MonsterObjectItem) => {
        return item.types.includes(sanitizedType);
      }
    );
    //to reset page to 1 for filtered results
    router.push(`/?page=1&per_page=${per_page}`)
    setFilteredData(filteredData);
    setLoading(false)
  }

  return (
    <main className="md:pb-20 pb-10">
      <div className="display flex justify-center py-6 font-bold text-6xl text-[#fbd743]">
        Pokedex
      </div>
      <div className="lg:block hidden">
        <PaginationControls
          hasNextPage={end < displayData.length}
          hasPrevPage={start > 0}
          dataLength={displayData.length}
        />
      </div>
      <div
        onClick={() => {
          filterByNameHandle("charmeleon")
        }}
      >
        Name
      </div>
      <div
        onClick={() => {
          filterByTypeHandle("fire");
        }}
      >
        Type
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex justify-center lg:pt-15 pt-10">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-6 gap-4 lg:px-0 md:px-4 px-2 lg:pb-0 pb-10">
            {entries.map((item: PokemonItem) => {
              const { id, name } = item;
              const capitalizedName = name[0].toUpperCase() + name.slice(1);
              return (
                <div
                  key={`${name}-${id}`}
                  className="border border-[#fbd743] rounded-lg cursor-pointer hover:opacity-25"
                >
                  <Link
                    href={`/pokemon/${id}`}
                    shallow
                    onClick={() => {
                      setLoading(true);
                    }}
                  >
                    <div className="flex justify-center font-bold text-[#ff1f1f] text-lg pt-2">
                      {capitalizedName}
                    </div>
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                      width={500}
                      height={500}
                      alt={`Pokemon Picture ${id}`}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!loading && (
        <div className="pb-10 lg:hidden block">
          <PaginationControls
            hasNextPage={end < pokemonData.length}
            hasPrevPage={start > 0}
            dataLength={pokemonData.length}
          />
        </div>
      )}
    </main>
  );
}
