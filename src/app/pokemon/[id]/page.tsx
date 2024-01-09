import React from "react";
import Image from "next/image";
import BackButton from "@/components/BackButton";

interface AbilityData {
  pokemon_v2_ability: { name: string };
}

interface StatData {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

interface TypeData {
  slot: number;
  type: { name: string; url: string };
}

export default async function PokemonPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  //retrieves monster data

  const monsterInfoRes = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query ($offset: Int, $limit: Int, $where: pokemon_v2_pokemonspecies_bool_exp, $orderBy: [pokemon_v2_pokemonspecies_order_by!]) {
            pokemons: pokemon_v2_pokemonspecies(offset: $offset, limit: $limit, order_by: $orderBy, where: {id: {_eq: ${id}}}) {
              id
              name
              info: pokemon_v2_pokemons_aggregate(limit: 1) {
                nodes {
                  stats: pokemon_v2_pokemonstats {
                    base_stat
                    stat: pokemon_v2_stat {
                      name
                    }
                  }
                  types: pokemon_v2_pokemontypes {
                    type: pokemon_v2_type {
                      name
                    }
                  }
                  abilities: pokemon_v2_pokemonabilities {
                    pokemon_v2_ability {
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

  const monsterInfoData = await monsterInfoRes.json();

  const { pokemons } = monsterInfoData.data;

  const pokemonData = pokemons[0];

  const {
    name: pokemonName,
    id: pokemonId,
    evolution_chain_id: evolutionChainId,
  } = pokemonData;

  const {stats:pokemonStats, types:pokemonTypes, abilities:pokemonAbilities } = pokemonData.info.nodes[0]

  //retrieve evolutions chain data

  const evolutionChainRes = await fetch(
    "https://beta.pokeapi.co/graphql/v1beta",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        query getEvolutionChainData {
            evolution: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {}, pokemon_v2_evolutionchain: {id: {_eq: ${evolutionChainId}}}}, order_by: {order: asc}) {
              name
              id
              evolution_chain_id
              evolves_from_species_id
            }
          }
          
              `,
      }),
    }
  );
  const evolutionChainData = await evolutionChainRes.json();

  const { evolution:evolutionData } = evolutionChainData.data;
  const capitalizedName = pokemonName[0].toUpperCase() + pokemonName.slice(1);
  return (
    <div className="pb-10">
      <BackButton />
      <div className="flex justify-center">
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          width={550}
          height={550}
          alt={`Pokemon Picture ${id}`}
          priority
        />
      </div>
      <div className="flex justify-center">
        <div className="w-fit text-center border px-20 py-4 border-[#fbd743] rounded-lg">
          <div className="flex flex-col">
            <div className="text-2xl font-bold text-[#ff1f1f]">
              {capitalizedName}
            </div>
            <div className="font-medium text-lg mt-4">Stats</div>
            <div>
              {pokemonStats.map((item: StatData) => {
                const capitalizedStatName =
                  item.stat.name[0].toUpperCase() + item.stat.name.slice(1);
                return (
                  <div key={`${item.stat.name}-${item.base_stat}`}>
                    {capitalizedStatName} : {item.base_stat}
                  </div>
                );
              })}
            </div>
            <div className="font-medium text-lg mt-4">Types</div>
            <div>
              {pokemonTypes.map((item: TypeData) => {
                const capitalizedTypeName =
                  item.type.name[0].toUpperCase() + item.type.name.slice(1);
                return (
                  <div key={`${item.type.name}-${item.type.url}`}>
                    {capitalizedTypeName}
                  </div>
                );
              })}
            </div>
            <div className="font-medium text-lg mt-4">Abilities</div>
            {pokemonAbilities.map((item: AbilityData) => {
              const { name } = item.pokemon_v2_ability;
              const capitalizedAbilityName =
                name[0].toUpperCase() + name.slice(1);
              return (
                <div key={`ability-${name}`}>{capitalizedAbilityName}</div>
              );
            })}
            <div className="font-medium text-lg mt-4">Evolution Chain</div>
            <div className="flex justify-center">
              {evolutionData.map((item: any) => {
                const isOneImage = evolutionData.length === 1;
                const capitalizeEvolutionName =
                  item.name[0].toUpperCase() + item.name.slice(1);
                return (
                  <div key={`evolution-chain-image${item.id}`}>
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`}
                      width={isOneImage ? 200 : 150}
                      height={isOneImage ? 200 : 150}
                      alt={`Pokemon Picture ${id}`}
                      priority
                    />
                    <div className="font-medium">{capitalizeEvolutionName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
