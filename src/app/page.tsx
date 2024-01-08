import React from 'react'
import Image from "next/image";
import PaginationControls from '@/components/PaginationControls'

interface PokemonItem {
  name: string,
  id: number
}

interface PokemonTypeItem {
  id: number,
  pokemon_id: number,
  pokemon_v2_type: {name:string, id:number}
}

export default async function Home(
  {
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  }
) {
  const page = searchParams['page'] ?? '1'
  const per_page = searchParams['per_page'] ?? '6'

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

  const start = (Number(page) - 1) * Number(per_page)
  const end = start + Number(per_page)

  const entries = pokemonData.slice(start, end)
  
  return (
    <main>
      <div className="display flex justify-center py-6 font-bold text-6xl text-red-700">Pokedex</div>
      <PaginationControls
        hasNextPage={end < pokemonData.length}
        hasPrevPage={start > 0}
        dataLength={pokemonData.length}
      />
      {/* <HomePage /> */}
      <div className="flex justify-center">
      <div className="mt-2 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
        {entries.map((item:PokemonItem) => {
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
      
    </main>
  )
}