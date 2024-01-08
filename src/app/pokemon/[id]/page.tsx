import React, { useEffect } from "react"

export default function PokemonPage({params}: {params: {id:string}}) {

    const {id} = params

  return <div>This is the pokemon page id:{id}</div>;
}
