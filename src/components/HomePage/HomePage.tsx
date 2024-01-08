import Image from "next/image";
import React, { useEffect, useMemo } from "react";

type PokemonItem = {
    name: string,
    id: number
}

type PokemonTypeItem = {
    id: number,
    pokemon_id: number,
    pokemon_v2_type: {name:string, id:number}
}

export default async function HomePage() {
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

  const { gen1_species: pokemonData, pokemon_v2_pokemontype: pokemonTypeData }: {gen1_species:PokemonItem[], pokemon_v2_pokemontype:PokemonTypeItem[]} = data.data;

  let monsterMap:any = {}

  function restructureData (){
    pokemonData.forEach((item:PokemonItem) =>{
        if (!monsterMap[item.id]){
            monsterMap[item.id] = {name:item.name, type:[]}
        }
    })
    pokemonTypeData.forEach((item:PokemonTypeItem)=>{
        if (item.pokemon_id in monsterMap){
            monsterMap[item.pokemon_id].type.push(item.pokemon_v2_type.name)
        }
    })
  }

  restructureData()

  return (
    <div className="flex justify-center">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
        {pokemonData.map((item:PokemonItem) => {
          const {id, name} = item
          return (
            <div key={`${name}-${id}`}>
              <div className="flex justify-center font-bold">{name}</div>
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
  );
}
