import React from "react";
import Image from "next/image";
import PaginationControls from "@/components/PaginationControls";

interface PokemonItem {
  name: string;
  id: number;
}

interface PokemonTypeItem {
  id: number;
  pokemon_id: number;
  pokemon_v2_type: { name: string; id: number };
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "6";

  const res = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
              query samplePokeAPIquery {
                  gen1_species: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}, order_by: {id: asc}) {
                name
                id
              }
              pokemon_v2_pokemontype {
                id
                pokemon_id
                pokemon_v2_type {
                  name
                  id
                }
              }
            }
              `,
    }),
  });
  const data = await res.json();

  const {
    gen1_species: pokemonData,
    pokemon_v2_pokemontype: pokemonTypeData,
  }: {
    gen1_species: PokemonItem[];
    pokemon_v2_pokemontype: PokemonTypeItem[];
  } = data.data;

  let monsterMap: any = {};

  function restructureData() {
    pokemonData.forEach((item: PokemonItem) => {
      if (!monsterMap[item.id]) {
        monsterMap[item.id] = { name: item.name, type: [] };
      }
    });
    pokemonTypeData.forEach((item: PokemonTypeItem) => {
      if (item.pokemon_id in monsterMap) {
        monsterMap[item.pokemon_id].type.push(item.pokemon_v2_type.name);
      }
    });
  }

  restructureData();

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const entries = pokemonData.slice(start, end);

  return (
    <main className="pb-20">
      <div className="display flex justify-center py-6 font-bold text-6xl text-[#fbd743]">
        Pokedex
      </div>
      <div className="lg:block hidden">
        <PaginationControls
          hasNextPage={end < pokemonData.length}
          hasPrevPage={start > 0}
          dataLength={pokemonData.length}
        />
      </div>
      <div className="flex justify-center lg:pt-15 pt-10">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {entries.map((item: PokemonItem) => {
            const { id, name } = item;
            const capitalizedName = name[0].toUpperCase() + name.slice(1)
            return (
              <div key={`${name}-${id}`} className="border border-[#fbd743] rounded-lg cursor-pointer hover:opacity-25">
                <div className="flex justify-center font-bold text-[#ff1f1f] text-lg pt-2">{capitalizedName}</div>
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  width={500}
                  height={500}
                  alt={`Pokemon Picture ${id}`}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="pb-10 lg:hidden block">
        <PaginationControls
          hasNextPage={end < pokemonData.length}
          hasPrevPage={start > 0}
          dataLength={pokemonData.length}
        />
      </div>
    </main>
  );
}
