import { SeasonHeader } from "../SingleMarket/SeasonHeader"
import { HomeCarousel } from "./HomeCarousel"
import { SeasonGames } from "../SingleMarket/SeasonGames";
import { useGetSeasonsQuery } from "../../store/seasons";
import { SportContext } from "../../contexts/sport";
import { useContext, useEffect, useState } from "react"
import { LABELS, Season } from "../../constants";
import { Loader } from "../Loader";
import { LiveMarkets } from "./LiveMarkets";
import { SportsList } from "./SportsList";
import { useMediaQuery } from "../../utils/utils";
import { Button } from "antd";
import { SeasonGamesMatch } from "../SingleMarket/SeasonGamesMatch";

export const SeasonsView = () => {
    const { sport, changeSport } = useContext(SportContext)
    const { data, error, isLoading, refetch } = useGetSeasonsQuery(sport ? sport?.sportId : 0)
    const [gameId, setGameId] = useState<number>(-1)
    const [selectedSeason, changeSeason] = useState<Season>();
    const [search, setSearch] = useState("")
    const [switchVal, setSwitchVal] = useState<number>(0)
    let isMobile = useMediaQuery(`(max-width: 400px)`);
    useEffect(() => {
      setGameId(-1);
      setSwitchVal(0);
    }, [sport])
    // console.log(data)
    return (
      <>
        <LiveMarkets game={gameId} backToSeason={setGameId} />
        { gameId == -1 &&
        <>
          {/* <HomeCarousel /> */}
          <SportsList />
          <SeasonHeader
            refetch={refetch}
            seasonName={sport?.sportName}
            value={search}
            onChange={setSearch}
            switchVal={switchVal}
            setSwitchVal={setSwitchVal}
          />
        </>
        }
        {error ? LABELS.SERVER_ERROR : null}
        {isLoading ? <Loader /> : null}
        {/* {switchVal == 0 ? */}
          <>
          {/* {gameId == -1 ? ( */}
          {
            data?.map(season =>
              <SeasonGames
                season={season}
                search={search}
                key={season.season.seasonId}
                goToGame={(id: number) => {
                  setGameId(id);
                  changeSeason(season);
                }}
              />
            )
          // )
          // : selectedSeason &&
          //   <SeasonGamesMatch season={selectedSeason} matchId={gameId} />
          }
          </>
        {/* :
          <div style={{
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <h3>Future betting is coming soon</h3>
          </div>
        } */}
        {isMobile && gameId == -1 &&
          <div style={isMobile ? {display: 'flex', width: '100%', flexDirection: 'inherit', justifyContent: 'center'} : {display: 'none'}}>
            <Button type="text" onClick={() => setSearch('')} style={{width: '95%'}}>Clear Search</Button>
          </div>
        }
      </>
    )
}