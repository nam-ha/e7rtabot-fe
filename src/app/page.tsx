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
      herosStats={herosStats}
    />
  );

  return (
    <main id="main-body" className="flex flex-col items-center justify-center w-full h-full p-16">
      <div id="cont-announcement" className="flex flex-wrap w-full border-2 rounded-b-xl border-gray-500 p-6">
        <h1 id="h1-announcement-header" className="flex items-center w-full text-2xl font-bold">
          Welcome!
        </h1>

        <p id="p-announcement-introduction" className="flex w-full pt-2">
          This is an AI application that can analyze an RTA match-ups and predict the winrate and team contribution before it even starts!
        </p>

        <div id="cont-announcement-update" className="grid grid-rows-[30px_1fr] grid-cols-[1fr_30px] w-full pt-4">
          <h2 id="h2-announcement-update-header" className="row-span-1 row-start-1 col-span-1 col-start-1 flex items-center text-xl font-bold ">
            Update
          </h2>

          <ul id="ul-announcement-update-list" className="row-span-1 row-start-2 col-span-1 col-start-1 flex flex-wrap w-full pt-2 list-disc list-inside">
            <li className="w-full">
              2021/08/01: Update
            </li>

            <li className="w-full pt-1">
              2021/08/01: Update
            </li>
          </ul>

          <button className="row-span-1 row-start-1 col-span-1 col-start-2"> X </button>
        </div>
      </div>

      <div id="cont-match-input" className="grid grid-cols-[30%_70%] gap-12 w-full h-full border-2 rounded-t-xl border-gray-500 p-6">
        <div id="cont-match-input-avatars-pane" className="col-span-1 col-start-1 flex flex-col w-full">
          <div id="cont-match-input-avatars-pane-filters" className="flex flex-col gap-2 w-full">
            <ul id="cont-class-filter" className="flex gap-1 border-1 border-gray-500">
              {
                renderClassFilter(classesFilename)
              }
              
            </ul>

            <ul id="cont-element-filter" className="flex gap-1 border-1 border-gray-500">
              {
                renderElementFilter(elementsFilename)
              }
            </ul>

            <ul id="cont-stars-filter border-1 border-gray-500" className="flex gap-1 border-1 border-gray-500">
              {
                renderStarsFilter(starssFilename)
              }
            </ul>
          </div>

          <div id="cont-match-input-avatars-pane-avatars" className="w-full pt-4">
            <ul id="cont-avatars" className="flex flex-wrap gap-6 w-full h-64 overflow-y-scroll">
              {
                renderAvatars(herosCode)
              }
            </ul>

          </div>

        </div>

        <div id="cont-match-input-teams" className="col-span-1 col-start-2 w-full">
          <div className="grid grid-cols-2 gap-6">
            <div id="cont-my-team" className="">
              {
                Picks(
                  {
                    id: "my-team",
                    className: "col-span-1 col-start-1 w-full",
                    herosCode: ["abigail", "undefined", "undefined", "undefined", "undefined"],
                    herosName: ["Abigail", "", "", "", ""]
                  }
                )
              }
            </div>

            <div id="cont-opp-team" className="">
              {
                Picks(
                  {
                    id: "opp-team",
                    className: "col-span-1 col-start-2 w-full",
                    herosCode: ["afternoon_soak_flan", "undefined", "undefined", "undefined", "undefined"],
                    herosName: ["Afternoon Soak Flan", "", "", "", ""]
                  }
                )
              }
            </div>
          </div>
          

          <div id="cont-match-input-teams-buttons">
            <button className="btn-clear"> Clear </button>

            <button className="btn-submit"> Submit </button>
          </div>
        </div>

        

      </div>

      <div id="cont-result" className="flex flex-col w-full p-6">
          <div className="flex flex-row items-start">
            <h2 className="pr-6 text-3xl font-bold">Result</h2>
            <p className="flex items-end h-full text-xl">50.00%</p>
          </div>
          
          <div id="cont-result-my-team" className="w-full pt-8">
            <h3> My team </h3>
            <div className="grid grid-cols-3 gap-4 w-full">
            
              <div id="cont-my-team-dd" className="col-span-1 col-start-1 flex flex-col w-full">
                <h4 className="">
                  Damage dealt
                </h4>

                <ul>
                  <li className="grid grid-cols-[56px_1fr] gap-2 w-full">
                    <Image src="/assets/avatars/abigail.png" alt="abigail.png" width="56" height="56" className="col-span-1 col-start-1"/>
                    <div className="grid grid-rows-2 gap-1 w-full">
                      <div className="bg-blue-500 w-[50%] h-full">

                      </div>

                      <p> 50.00% </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="cont-my-team-ds" className="col-span-1 col-start-2 flex flex-col w-full">
                <h4 className="">
                  Damage taken
                </h4>

                <ul>
                  <li className="grid grid-cols-[56px_1fr] gap-2 w-full">
                    <Image src="/assets/avatars/abigail.png" alt="abigail.png" width="56" height="56" className="col-span-1 col-start-1"/>
                    <div className="grid grid-rows-2 gap-1 w-full">
                      <div className="bg-blue-500 w-[50%] h-full">

                      </div>

                      <p> 50.00% </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="cont-my-team-cs" className="col-span-1 col-start-3 flex flex-col w-full">
                <h4 className="">
                  Combat support
                </h4>

                <ul>
                  <li className="grid grid-cols-[56px_1fr] gap-2 w-full">
                    <Image src="/assets/avatars/abigail.png" alt="abigail.png" width="56" height="56" className="col-span-1 col-start-1"/>
                    <div className="grid grid-rows-2 gap-1 w-full">
                      <div className="bg-blue-500 w-[50%] h-full">

                      </div>

                      <p> 50.00% </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div id="cont-result-opp-team" className="w-full pt-8">
            <h3> Opponent's team </h3>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div id="cont-my-team-dd" className="col-span-1 col-start-1 flex flex-col w-full">
                <h4 className="">
                  Damage dealt
                </h4>

                <ul>
                  <li className="grid grid-cols-[56px_1fr] gap-2 w-full">
                    <Image src="/assets/avatars/abigail.png" alt="abigail.png" width="56" height="56" className="col-span-1 col-start-1"/>
                    <div className="grid grid-rows-2 gap-1 w-full">
                      <div className="bg-blue-500 w-[50%] h-full">

                      </div>

                      <p> 50.00% </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="cont-my-team-dd" className="col-span-1 col-start-2 flex flex-col w-full">
                <h4 className="">
                  Damage taken
                </h4>

                <ul>
                  <li className="grid grid-cols-[56px_1fr] gap-2 w-full">
                    <Image src="/assets/avatars/abigail.png" alt="abigail.png" width="56" height="56" className="col-span-1 col-start-1"/>
                    <div className="grid grid-rows-2 gap-1 w-full">
                      <div className="bg-blue-500 w-[50%] h-full">

                      </div>

                      <p> 50.00% </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div id="cont-my-team-dd" className="col-span-1 col-start-3 flex flex-col w-full">
                <h4 className="">
                  Combat support
                </h4>

                <ul>
                  <li className="grid grid-cols-[56px_1fr] gap-2 w-full">
                    <Image src="/assets/avatars/abigail.png" alt="abigail.png" width="56" height="56" className="col-span-1 col-start-1"/>
                    <div className="grid grid-rows-2 gap-1 w-full">
                      <div className="bg-blue-500 w-[50%] h-full">

                      </div>

                      <p> 50.00% </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
      </div>

    </main>
    
  );
}
