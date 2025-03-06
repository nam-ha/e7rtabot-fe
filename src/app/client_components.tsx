"use client";

import React, {useState, useEffect} from "react";
import Image from "next/image";

const elementsName = ["fire", "ice", "earth", "light", "dark"];
const classesName = ["knight", "warrior", "thief", "mage", "ranger", "soul_weaver"];
const starssName = ["5", "4", "3"];

function valueToViridisHex(value: number): string {
  const viridisColors = [
    "#440154", "#482878", "#3E4A89", "#31678E",
    "#26828E", "#1F9E89", "#35B779", "#6DCD59",
    "#B4DE2C", "#FDE725"
  ];

  // Clamp value to [0,1]
  value = Math.max(0, Math.min(1, value));

  // Scale value to match color index
  const index = value * (viridisColors.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.min(lowerIndex + 1, viridisColors.length - 1);
  const t = index - lowerIndex; // Interpolation factor

  // Parse hex to RGB
  const hexToRgb = (hex: string) => hex.match(/\w\w/g)!.map(c => parseInt(c, 16));
  const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`;

  const [r1, g1, b1] = hexToRgb(viridisColors[lowerIndex]);
  const [r2, g2, b2] = hexToRgb(viridisColors[upperIndex]);

  // Linear interpolation between colors
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return rgbToHex(r, g, b);
}

function renderAvatars(herosCode: string[]) {
  function handleDragStart(e: React.DragEvent<HTMLImageElement>, heroCode: string) {
    e.dataTransfer.setData("heroCode", heroCode);
  }

  return herosCode.map((heroCode, index) => (
    <li key={index} className="w-auto h-auto">
      <Image src={`/assets/avatars/${heroCode}.png`} alt={heroCode} width="56" height="56" draggable className="cursor-grab" onDragStart={(e) => handleDragStart(e, heroCode)}/>
    </li>
  ));
}

interface PickProps {
  heroCode: string;
  heroName: string;
  index: number;
}

interface PicksProps {
  id: string;
  className: string;
  herosCode: string[];
  herosName: string[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ClientComponentsProps  {
    herosCode: string[];
    heros: any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function ClientComponents(
  {
      herosCode,
      heros,
  }: ClientComponentsProps
)
{
  /* Filter States*/
  const [classesFilter, setClassesFilter] = useState<string[]>([]);
  const [elementsFilter, setElementsFilter] = useState<string[]>([]);
  const [starsFilter, setStarsFilter] = useState<string[]>([]);
  const [filteredHerosCode, setFilteredHerosCode] = useState<string[]>(herosCode);
  
  /* Input States */
  const [myPicks, setMyPicks] = useState<string[]>(["undefined", "undefined", "undefined", "undefined", "undefined"]);
  const [oppPicks, setOppPicks] = useState<string[]>(["undefined", "undefined", "undefined", "undefined", "undefined"]);
  const [myPostbanIndex, setMyPostbanIndex] = useState<number | null>(null);
  const [oppPostbanIndex, setOppPostbanIndex] = useState<number | null>(null);

  /* Output States */
  const [result, setResult] = useState<number>(0)
  const [outputMyPicks, setOutputMyPicks] = useState<string[]>([]);
  const [outputOppPicks, setOutputOppPicks] = useState<string[]>([]);
  const [myPicksDD, setMyPicksDD] = useState<number[]>([0.5, 0.5, 0.75, 0.5]);
  const [oppPicksDD, setOppPicksDD] = useState<number[]>([0, 0, 0, 0]);
  const [myPicksDS, setMyPicksDS] = useState<number[]>([0, 0, 0, 0]);
  const [oppPicksDS, setOppPicksDS] = useState<number[]>([0, 0, 0, 0]);
  const [myPicksCS, setMyPicksCS] = useState<number[]>([0, 0, 0, 0]);
  const [oppPicksCS, setOppPicksCS] = useState<number[]>([0, 0, 0, 0]);
  const [myDDDistribution, setMyDDDistribution] = useState<number[]>([0.75, 0.25, 0.25, 0.25]);
  const [oppDDDistribution, setOppDDDistribution] = useState<number[]>([0, 0, 0, 0]);
  const [myDSDistribution, setMyDSDistribution] = useState<number[]>([0, 0, 0, 0]);
  const [oppDSDistribution, setOppDSDistribution] = useState<number[]>([0, 0, 0, 0]);
  const [myCSDistribution, setMyCSDistribution] = useState<number[]>([0, 0, 0, 0]);
  const [oppCSDistribution, setOppCSDistribution] = useState<number[]>([0, 0, 0, 0]);

  /* Button States */
  const [isBtnSubmitDisabled, setIsBtnSubmitDisabled] = useState<boolean>(true)

  /* Component States */
  const [isUpdateHidden, setIsUpdateHidden] = useState<boolean>(false);
  const [isGuideHidden, setIsGuideHidden] = useState<boolean>(false);

  function renderClassFilter(classesName: string[]) {
    function handleSelectFilterValue(className: string)
    {
      setClassesFilter(prevClassesFilter =>
        prevClassesFilter.includes(className)
          ? prevClassesFilter.filter(name => name !== className)
          : [...prevClassesFilter, className]
      );
    }

    return classesName.map((className, index) => (
      <li key={index} className={`w-12 h-full border border-gray-500 cursor-pointer hover:bg-blue-200 ${classesFilter.includes(className) ? "bg-yellow-400" : ""}`} onClick={() => handleSelectFilterValue(className)}>
        <Image src={`/assets/classes/${className}.png`} alt={className} width="24" height="24" />
      </li>
    ));
  }

  function renderElementFilter(elementsName: string[]) {
    function handleSelectFilterValue(elementName: string)
    {
      setElementsFilter(prevElementsFilter =>
        prevElementsFilter.includes(elementName)
          ? prevElementsFilter.filter(name => name !== elementName)
          : [...prevElementsFilter, elementName]
      );
    }

    return elementsName.map((elementName, index) => (
      <li key={index} className={`w-12 h-full border border-gray-500 cursor-pointer hover:bg-blue-200 ${elementsFilter.includes(elementName) ? "bg-yellow-400" : ""}`} onClick={() => handleSelectFilterValue(elementName)}>
        <Image src={`/assets/elements/${elementName}.png`} alt={elementName} width="24" height="24" />
      </li>
    ));
  }

  function renderStarsFilter(starssName: string[]) {
    function handleSelectFilterValue(starsName: string)
    {
      setStarsFilter(prevStarsFilter =>
        prevStarsFilter.includes(starsName)
          ? prevStarsFilter.filter(name => name !== starsName)
          : [...prevStarsFilter, starsName]
      );
    }

    return starssName.map((starsName, index) => (
      <li key={index} className={`w-auto h-full border border-gray-500 cursor-pointer hover:bg-blue-200 ${starsFilter.includes(starsName) ? "bg-yellow-400" : ""}`} onClick={() => handleSelectFilterValue(starsName)}>
        <Image src={`/assets/stars/${starsName}_stars.png`} alt={starsName} width="99" height="22"/>
      </li>
    ));
  }

  useEffect(
    () => {
      function filterHeros() {
        let starsFilterValues = starsFilter;
        let elementsFilterValues = elementsFilter;
        let classesFilterValues = classesFilter;

        if (starsFilter.length === 0) {
          starsFilterValues = starssName;
        }

        if (elementsFilter.length === 0) {
          elementsFilterValues = elementsName;
        }

        if (classesFilter.length === 0) {
          classesFilterValues = classesName;
        }

        setFilteredHerosCode(
          herosCode.filter(
            heroCode => 
              starsFilterValues.includes(heros[heroCode].star) && 
              elementsFilterValues.includes(heros[heroCode].element) && 
              classesFilterValues.includes(heros[heroCode].class) && 
              !myPicks.includes(heroCode) && 
              !oppPicks.includes(heroCode)
          )
        )
      }

      filterHeros();
    },
    [classesFilter, elementsFilter, starsFilter, myPicks, oppPicks] // eslint-disable-line react-hooks/exhaustive-deps
  )

  useEffect(
    () => {
      function validatePicks() {
        if (myPicks.includes("undefined") || oppPicks.includes("undefined") || myPostbanIndex === null || oppPostbanIndex === null) {
          setIsBtnSubmitDisabled(true);
        } else {
          setIsBtnSubmitDisabled(false);
        }
      }

      validatePicks();
    },
    [myPicks, oppPicks, myPostbanIndex, oppPostbanIndex]
  )

  function clearFilters() {
    setClassesFilter([]);
    setElementsFilter([]);
    setStarsFilter([]);
  }

  function renderMyPicks({id, className, herosCode, herosName}: PicksProps) {
    function renderMyPick({heroCode, heroName, index}: PickProps) {
      function handleDragOver(e: React.DragEvent<HTMLImageElement>) {
        e.preventDefault();
      }
    
      function handleDrop(e: React.DragEvent<HTMLImageElement>, index: number) {
        e.preventDefault();
        const heroCode = e.dataTransfer.getData("heroCode");
        if (heroCode) {
          setMyPicks(prevMyPicks => {
            const newMyPicks = [...prevMyPicks];
            newMyPicks[index] = e.dataTransfer.getData("heroCode");
            
            return newMyPicks;
          });
        }

        clearFilters();
      }
      
      return (
        <li key={index} className={`grid grid-cols-[56px_1fr_56px] gap-2 w-full h-auto p-2 ${myPostbanIndex === index ? "opacity-30" : ""}`}>
          <Image src={`/assets/avatars/${heroCode}.png`} alt={`${heroCode}.png`} width="56" height="56" className="col-span-1 col-start-1" onDrop={(e) => handleDrop(e, index)} onDragOver={(e) => handleDragOver(e)}/>
          <p className="col-span-1 col-start-2 flex items-center"> {heroName} </p>
          <button 
            className={`col-span-1 col-start-3 bg-red-400 cursor-pointer hover:bg-red-300 active:scale-95`}
            onClick={() => {setMyPostbanIndex(index);console.log(myPostbanIndex, index);}}
          > 
            Ban 
          </button>
        </li>
      );
    }

    return (
      <ul id={id} className={className}>
        {
          herosCode.map((heroCode, index) => (
            renderMyPick(
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

  function renderOppPicks({id, className, herosCode, herosName}: PicksProps) {
    function renderOppPick({heroCode, heroName, index}: PickProps) {
      function handleDragOver(e: React.DragEvent<HTMLImageElement>) {
        e.preventDefault();
      }
    
      function handleDrop(e: React.DragEvent<HTMLImageElement>, index: number) {
        e.preventDefault();
        const heroCode = e.dataTransfer.getData("heroCode");
        if (heroCode) {
          setOppPicks(prevOppPicks => {
            const newOppPicks = [...prevOppPicks];
            newOppPicks[index] = e.dataTransfer.getData("heroCode");
            
            return newOppPicks;
          });
        }

        clearFilters();
      }
    
      return (
        <li key={index} className={`grid grid-cols-[56px_1fr_56px] gap-2 w-full h-auto p-2 ${oppPostbanIndex === index ? "opacity-30" : ""}`}>
          <Image src={`/assets/avatars/${heroCode}.png`} alt={`${heroCode}.png`} width="56" height="56" className="col-span-1 col-start-1" onDrop={(e) => handleDrop(e, index)} onDragOver={(e) => handleDragOver(e)}/>
          <p className="col-span-1 col-start-2 flex items-center"> {heroName} </p>
          <button 
            className={`col-span-1 col-start-3 bg-red-400 cursor-pointer hover:bg-red-300 active:scale-95`}
            onClick={() => {setOppPostbanIndex(index);console.log(oppPostbanIndex, index);}}
          > 
            Ban 
          </button>
        </li>
      );
    }

    return (
      <ul id={id} className={className}>
        {
          herosCode.map((heroCode, index) => (
            renderOppPick(
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

  function handleClear() {
    setMyPicks(["undefined", "undefined", "undefined", "undefined", "undefined"]);
    setOppPicks(["undefined", "undefined", "undefined", "undefined", "undefined"]);
    setMyPostbanIndex(null);
    setOppPostbanIndex(null);
    setResult(0);
    setOutputMyPicks(["undefined", "undefined", "undefined", "undefined"]);
    setOutputOppPicks(["undefined", "undefined", "undefined", "undefined"]);
    setMyDDDistribution([0, 0, 0, 0]);
    setOppDDDistribution([0, 0, 0, 0]);
    setMyDSDistribution([0, 0, 0, 0]);
    setOppDSDistribution([0, 0, 0, 0]);
    setMyCSDistribution([0, 0, 0, 0]);
    setOppCSDistribution([0, 0, 0, 0]);
    setMyPicksDD([0, 0, 0, 0]);
    setOppPicksDD([0, 0, 0, 0]);
    setMyPicksDS([0, 0, 0, 0]);
    setOppPicksDS([0, 0, 0, 0]);
    setMyPicksCS([0, 0, 0, 0]);
    setOppPicksCS([0, 0, 0, 0]);
  }

  async function getAPIPredict()
  {
    setIsBtnSubmitDisabled(true);

    try {
      const response = await fetch("https://e7rtabot-api-1030067260954.us-central1.run.app/api/v1/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            "myPicksCode": myPicks.filter((_, index) => index !== myPostbanIndex),
            "oppPicksCode": oppPicks.filter((_, index) => index !== oppPostbanIndex),
            "myPlayerId": "global",
            "oppPlayerId": "global",
          }
        ),
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data)
      
      setOutputMyPicks(myPicks.filter((_, index) => index !== myPostbanIndex));
      setOutputOppPicks(oppPicks.filter((_, index) => index !== oppPostbanIndex));
      setMyDDDistribution(data.myDDDistribution);
      setOppDDDistribution(data.oppDDDistribution);
      setMyDSDistribution(data.myDSDistribution);
      setOppDSDistribution(data.oppDSDistribution);
      setMyCSDistribution(data.myCSDistribution);
      setOppCSDistribution(data.oppCSDistribution);
      setMyPicksDD(data.myPicksDD);
      setOppPicksDD(data.oppPicksDD);
      setMyPicksDS(data.myPicksDS);
      setOppPicksDS(data.oppPicksDS);
      setMyPicksCS(data.myPicksCS);
      setOppPicksCS(data.oppPicksCS);
      setResult(data.result[0]);

      setIsBtnSubmitDisabled(false);
      
    } catch (error) {
      console.error("Error fetching API:", error);
      setIsBtnSubmitDisabled(false);
      return null;
    }
  }

  function contributionSection(
    {
      herosCode,
      performance,
      distribution,
    }: {
      herosCode: string[];
      performance: number[];
      distribution: number[];
    }
  ) {
    return (
      <ul>
        {herosCode.map((heroCode, index) => (
          <li key={index} className="grid grid-cols-[56px_1fr] gap-2 w-full pt-4">
            <Image
              src={`/assets/avatars/${heroCode}.png`}
              alt={`${heroCode}.png`}
              width="56"
              height="56"
              className="col-span-1 col-start-1"
            />
            <div className="grid grid-rows-2 gap-1 w-full">
              <div
                className="h-full"
                style={{
                  backgroundColor: valueToViridisHex(performance[index]),
                  width: `${Math.round(distribution[index] * 100)}%`,
                }}
              ></div>
  
              <p className="">{`${(distribution[index] * 100).toFixed(2)}%`}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main id="main-body" className="flex flex-col items-center justify-center w-full h-full pl-16 pr-16">
      <div id="cont-announcement" className="flex flex-wrap w-full border-2 rounded-b-xl border-gray-500 p-6">
        <h1 id="h1-announcement-header" className="flex items-center w-full text-2xl font-bold">
          Welcome!
        </h1>

        <p id="p-announcement-introduction" className="flex w-full pt-2">
          This is an AI application that can analyze an RTA match-ups and predict the winrate and team contribution before it even starts!
        </p>

        <p id="p-announcement-introduction" className="flex w-full pt-2">
          If you encounter any bugs or have any suggestions regarding the new features, feel free to reach me on Discord: tokarinrika#3954
        </p>

        <div id="cont-announcement-update" className={`grid grid-rows-[30px_1fr] grid-cols-[1fr_30px] w-full pt-4`}>
          <h2 id="h2-announcement-update-header" className="row-span-1 row-start-1 col-span-1 col-start-1 flex items-center text-xl font-bold ">
            Update
          </h2>

          <ul id="ul-announcement-update-list" className={`row-span-1 row-start-2 col-span-1 col-start-1 flex flex-wrap w-full pt-2 ${isUpdateHidden ? "hidden" : ""}`}>
            <li className="w-full">
              <h3 className="font-bold"> 2025/03/04 </h3>
              <ul className="flex flex-wrap w-full pt-2 list-disc list-inside"> 
                <li className="w-full"> Added Fenne, Lone Wolf Peira, Tori </li>
                <li className="w-full"> Model updated with Damage Dealt, Damage Taken and Combat Support analysis </li>
                <li className="w-full"> New Drag and Drop UI </li>
              </ul>
            </li>
          </ul>

          <button 
            className="row-span-1 row-start-1 col-span-1 col-start-2"
            onClick={() => setIsUpdateHidden(!isUpdateHidden)}
          > X
          </button>
        </div>

        <div id="cont-announcement-usage" className={`grid grid-rows-[30px_1fr] grid-cols-[1fr_30px] w-full pt-4`}>
          <h2 id="h2-announcement-update-header" className="row-span-1 row-start-1 col-span-1 col-start-1 flex items-center text-xl font-bold ">
            How to read analysis
          </h2>

          <div
            className={`grid grid-cols-[400px_1fr] gap-6 w-full ${isGuideHidden ? "hidden" : ""}`}
          >
            <Image
              src="/assets/guide/example.png"
              alt="example"
              width="400"
              height="200"
              className="col-span-1 col-start-1"
            />

            <ul className="list-disc list-inside col-span-1 col-start-2">
              <li className="pt-4">
                There are 3 main categories of analysis: Damage Dealt, Damage Taken and Combat Support (combination of number of kills, buffing and debuffing)
              </li>

              <li className="pt-4">
                The length of the bar and the following percentage number represents the distribution of the hero in the categories of analysis. In the example, Afternoon Soak Flan should be dealing 25% of the damage from the whole team.
              </li>

              <li className="pt-4">
                The color of the bar represents the performance of the hero comparing to the average. Brighter means better performance. The average performance is of <span className="font-bold"style={{color: valueToViridisHex(0.75)}}>this color</span>. In the example, Afternoon Soak Flan should be dealing less than the amount she usually does.
              </li>
            </ul>
          </div>

          <button 
            className="row-span-1 row-start-1 col-span-1 col-start-2"
            onClick={() => setIsGuideHidden(!isGuideHidden)}
          > X
          </button>
        </div>

      </div>

      <div id="cont-match-input" className="grid grid-cols-[0.3fr_0.7fr] gap-16 w-full p-6">
        <div id="cont-match-input-avatars-pane" className="col-span-1 col-start-1 flex flex-col w-full">
          <div id="cont-match-input-avatars-pane-filters" className="flex flex-col gap-2 w-full pb-4">
            <ul id="cont-class-filter" className="flex gap-1">
              {
                renderClassFilter(classesName)
              }
              
            </ul>

            <ul id="cont-element-filter" className="flex gap-1">
              {
                renderElementFilter(elementsName)
              }
            </ul>

            <ul id="cont-stars-filter" className="flex gap-1">
              {
                renderStarsFilter(starssName)
              }
            </ul>
          </div>

          <div id="cont-match-input-avatars-pane-avatars" className="w-full h-79 pt-4 overflow-y-scroll">
            <ul id="cont-avatars" className="flex flex-wrap gap-6 w-full ">
              {
                renderAvatars(filteredHerosCode)
              }
            </ul>

          </div>

        </div>

        <div id="cont-match-input-teams" className="col-span-1 col-start-2 w-full">
          <div className="grid grid-cols-2 gap-6">
            <div id="cont-my-team" className="">
              {
                renderMyPicks(
                  {
                    id: "my-team",
                    className: "col-span-1 col-start-1 w-full",
                    herosCode: myPicks,
                    herosName: myPicks.map(heroCode => heros[heroCode].name)
                  }
                )
              }
            </div>

            <div id="cont-opp-team" className="">
              {
                renderOppPicks(
                  {
                    id: "opp-team",
                    className: "col-span-1 col-start-2 w-full",
                    herosCode: oppPicks,
                    herosName: oppPicks.map(heroCode => heros[heroCode].name)
                  }
                )
              }
            </div>
          </div>
          

          <div id="cont-match-input-teams-buttons" className="flex justify-end pt-4">
            <button className={`w-32 h-12 bg-gray-800 cursor-pointer hover:bg-gray-600 active:scale-95`} onClick={() => handleClear()}> Clear </button>

            <button 
              className={`w-32 h-12 bg-green-900 cursor-pointer hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`}
              disabled={isBtnSubmitDisabled}
              onClick={() => getAPIPredict()}
            > 
              Analyze 
            </button>
          </div>
        </div>
      </div>

      <div id="cont-result" className="flex flex-col w-full p-6 gap-8">
          <div className="flex flex-row items-end">
            <h2 className="pr-6 text-3xl font-bold"> Your winning chance: </h2>
            <p 
              className="flex h-full text-3xl"
              style={{color: valueToViridisHex(result)}}
            >
              
              {(result * 100).toFixed(2)}%
            </p>
          </div>
          
          <div id="cont-result-my-team" className="w-full p-8 border-2 border-gray-800">
            <h3 className="text-2xl font-bold"> Your team Analysis </h3>
            <div className="grid grid-cols-3 gap-4 w-full">
            
              <div id="cont-my-team-dd" className="col-span-1 col-start-1 flex flex-col w-full">
                <h4 className="text-xl font-bold pt-6">
                  Damage Dealt
                </h4>

                {
                  contributionSection(
                    {
                      herosCode: outputMyPicks,
                      performance: myPicksDD,
                      distribution: myDDDistribution
                    }
                  )
                }
              </div>

              <div id="cont-my-team-ds" className="col-span-1 col-start-2 flex flex-col w-full">
              <h4 className="text-xl font-bold pt-6">
                  Damage Taken
                </h4>

                {
                  contributionSection(
                    {
                      herosCode: outputMyPicks,
                      performance: myPicksDS,
                      distribution: myDSDistribution
                    }
                  )
                }
              </div>

              <div id="cont-my-team-cs" className="col-span-1 col-start-3 flex flex-col w-full">
              <h4 className="text-xl font-bold pt-6">
                  Combat Support
                </h4>

                {
                  contributionSection(
                    {
                      herosCode: outputMyPicks,
                      performance: myPicksCS,
                      distribution: myCSDistribution
                    }
                  )
                }
              </div>
            </div>
          </div>
          
          <div id="cont-result-my-team" className="w-full p-8 border-2 border-gray-800">
            <h3 className="text-2xl font-bold"> Opponent&apos;s team Analysis </h3>

            <div className="grid grid-cols-3 gap-4 w-full">
              <div id="cont-my-team-dd" className="col-span-1 col-start-1 flex flex-col w-full">
                <h4 className="text-xl font-bold pt-6">
                  Damage Dealt
                </h4>

                {
                  contributionSection(
                    {
                      herosCode: outputOppPicks,
                      performance: oppPicksDD,
                      distribution: oppDDDistribution
                    }
                  )
                }
              </div>

              <div id="cont-my-team-dd" className="col-span-1 col-start-2 flex flex-col w-full">
                <h4 className="text-xl font-bold pt-6">
                  Damage Taken
                </h4>

                {
                  contributionSection(
                    {
                      herosCode: outputOppPicks,
                      performance: oppPicksDS,
                      distribution: oppDSDistribution
                    }
                  )
                }
              </div>

              <div id="cont-my-team-dd" className="col-span-1 col-start-3 flex flex-col w-full">
                <h4 className="text-xl font-bold pt-6">
                  Combat Support
                </h4>

                {
                  contributionSection(
                    {
                      herosCode: outputOppPicks,
                      performance: oppPicksCS,
                      distribution: oppCSDistribution
                    }
                  )
                }
              </div>
            </div>
          </div>
          
      </div>

    </main>
  );
}