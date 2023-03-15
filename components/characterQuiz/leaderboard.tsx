interface Leaderboard {
    leaderboard: Array<object>
    total: number
}

const Leaderboard = ({ leaderboard, total }: Leaderboard) => {

    const _leaderboard = leaderboard ? leaderboard.slice(0, 15) : []
    
    for (let i = 0; i < 15; ++i) {
        if (_leaderboard[i] === undefined)
            _leaderboard[i] = { username: '?' }
    }

    return (
        <div className='max-w-80 mt-2 md:mt-0 rounded'>
            <div className='font-semibold bg-indigo-600 rounded p-2 text-white'>Leaderboard</div>
            <div className='flex flex-row gap-x-4 mt-2'>
                <div className='
                    w-4 pl-2 font-medium underline
                    text-gray-600'>
                    #
                </div>
                <div className='
                    w-36 pl-1 font-medium underline
                    text-gray-600'>
                    Username
                </div>
                <div className='
                    w-12 font-medium underline
                    text-gray-600'>
                    Score
                </div>
                <div className='
                    w-12 font-medium underline
                    text-gray-600'>
                    Time
                </div>
            </div>
            { _leaderboard.map((entry: any, index) => {
                const percent = (entry.score / total) * 100
                return (
                    <div 
                        key={index}
                        className={`flex flex-row items-center gap-x-4 h-8 border-b
                            ${index % 2 !== 0 ? 'bg-gray-50' : ''}`}>
                        <div className='w-4 pl-2 font-medium'>{index + 1}</div>
                        <div className='w-36 pl-1 truncate text-indigo-400 font-semibold'>
                            {entry.username}
                        </div>
                        { entry.score || entry.score === 0 ?
                            <div className='w-12'>
                                <span className='font-medium'>
                                    {percent}
                                </span>%
                            </div>
                            : <></>
                        }
                        { entry.time ?
                            <div className='w-12'>
                                <span className='font-medium'>
                                    {entry.time}
                                </span>s
                            </div>
                            : <></>
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default Leaderboard
