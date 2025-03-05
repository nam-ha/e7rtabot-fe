import fs from "fs";
import path from "path";

import "./_app.css"
import ClientComponents from "./client_components";

export default function Home() 
{
  const raw_heros = fs.readFileSync(
    path.join(process.cwd(), 'public/jsons/heros.json'),
    "utf-8"
  );

  const raw_heros_stats = fs.readFileSync(
    path.join(process.cwd(), 'public/jsons/heros_stats.json'),
    "utf-8"
  )

  const heros = JSON.parse(raw_heros);
  
  const herosStats = JSON.parse(raw_heros_stats);
  const herosCode = Object.keys(heros).sort((a, b) => (herosStats[b]?.total_appearance || 0) - (herosStats[a]?.total_appearance || 0));

  return (
    <ClientComponents
      heros={heros}
      herosCode={herosCode}
    />
  );
}
