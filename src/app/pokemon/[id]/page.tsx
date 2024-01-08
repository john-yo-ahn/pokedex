import React from "react";
import Image from "next/image";
import BackButton from "@/components/BackButton";

interface AbilityData {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
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
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();

  const speciesRes = await fetch(data.species.url);
  const speciesData = await speciesRes.json();

  const evolutionIdRes = await fetch(speciesData.evolution_chain.url);
  const evolutionIdData = await evolutionIdRes.json();
  const evolutionId = evolutionIdData.id;

  const evolutionChainRes = await fetch(
    "https://beta.pokeapi.co/graphql/v1beta",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
      query getEvolutionChainData {
        evolution: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {}, pokemon_v2_evolutionchain: {id: {_eq: ${evolutionId}}}}, order_by: {id: asc}) {
          name
          id
          evolution_chain_id
        }
      }
      
              `,
      }),
    }
  );
  const evolutionChainData = await evolutionChainRes.json();

  const { evolution } = evolutionChainData.data;
  const { abilities, stats, types, name, weight } = data;
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
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
              {stats.map((item: StatData) => {
                const capitalizedStatName =
                  item.stat.name[0].toUpperCase() + item.stat.name.slice(1);
                return (
                  <div key={`${item.stat.name}-${item.base_stat}`}>
                    {capitalizedStatName} : {item.base_stat} (Effort:{" "}
                    {item.effort})
                  </div>
                );
              })}
            </div>
            <div className="font-medium text-lg mt-4">Types</div>
            <div>
              {types.map((item: TypeData) => {
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
            {abilities.map((item: AbilityData) => {
              const { name, url } = item.ability;
              const capitalizedAbilityName =
                name[0].toUpperCase() + name.slice(1);
              return <div key={`${url}-${name}`}>{capitalizedAbilityName}</div>;
            })}
            <div className="font-medium text-lg mt-4">Evolution Chain</div>
            <div className="flex justify-center">
              {evolution.map((item: any) => {
                const isOneImage = evolution.length === 1
                const capitalizeEvolutionName = item.name[0].toUpperCase() + item.name.slice(1)
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
