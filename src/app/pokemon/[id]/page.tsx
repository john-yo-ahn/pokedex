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

  const { abilities, stats, types, name, weight } = data;
  const capitalizedName = name[0].toUpperCase() + name.slice(1);
  return (
    <div className="pb-10">
      <BackButton />
      <div className="flex justify-center">
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          width={600}
          height={600}
          alt={`Pokemon Picture ${id}`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
