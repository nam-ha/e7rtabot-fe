import fs from "fs";
import path from "path";
import Image from "next/image";

import "./_app.css"
import ClientComponents from "./client_components";

function renderClassFilter(classesFilename: string[]) {
  return classesFilename.map((classesFilename, index) => (
    <li key={index} className="w-12 h-full border border-gray-500">
      <Image src={`/assets/classes/${classesFilename}`} alt={classesFilename} width="24" height="24" />
    </li>
  ));
}

function renderStarsFilter(starssFilename: string[]) {
  return starssFilename.map((starsFilename, index) => (
    <li key={index} className="w-auto h-full border-1 border-gray-500">
      <Image src={`/assets/stars/${starsFilename}`} alt={starsFilename} width="99" height="22"/>
    </li>
  ));
}

function renderElementFilter(elementsFilename: string[]) {
  return elementsFilename.map((elementFilename, index) => (
    <li key={index} className="w-12 h-full border border-gray-500">
      <Image src={`/assets/elements/${elementFilename}`} alt={elementFilename} width="24" height="24" />
    </li>
  ));
}

function renderAvatars(herosCode: string[]) {
  return herosCode.map((heroCode, index) => (
    <li key={index} className="w-auto h-auto border border-gray-500">
      <Image src={`/assets/avatars/${heroCode}.png`} alt={heroCode} width="56" height="56" />
    </li>
  ));
}

interface PickProps {
  heroCode: string;
  heroName: string;
  index: number;
}

function Pick({heroCode, heroName, index}: PickProps) {
  return (
    <li key={index} className="grid grid-cols-[56px_1fr_56px] gap-2 w-full h-auto p-2">
      <Image src={`/assets/avatars/${heroCode}.png`} alt={`${heroCode}.png`} width="56" height="56" className="col-span-1 col-start-1"/>
      <p className="col-span-1 col-start-2 flex items-center"> {heroName} </p>
      <button className="col-span-1 col-start-3"> Ban </button>
    </li>
  );
}

interface PicksProps {
  id: string;
  className: string;
  herosCode: string[];
  herosName: string[];
}

function Picks({id, className, herosCode, herosName}: PicksProps) {
  return (
    <ul id={id} className={className}>
      {
        herosCode.map((heroCode, index) => (
          Pick(
            {
              heroCode: heroCode, 
              heroName: herosName[index],
              index: index
            }
          )
        ))
      }
    </ul>
  );
}

export default function Home() 
{
  const starssFilename = fs.readdirSync(
    path.join(process.cwd(), 'public/assets/stars')
  );
  const elementsFilename = fs.readdirSync(
    path.join(process.cwd(), 'public/assets/elements')
  );
  const classesFilename = fs.readdirSync(
    path.join(process.cwd(), 'public/assets/classes')
  );

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
