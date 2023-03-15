import Image from 'next/image'

type Props = {
    url: string
    character: string
    characterImage: string
}

const PersonalityConclusion = ({ url, character, characterImage }: Props) => {
    return (
        <div className='grid grid-cols-1'>
            <div className='text-center'>You got {character}!</div>
            <div className='relative w-80 h-44 mb-2'>
                <Image
                    src={`${url}/assets/${characterImage}`}
                    alt=''
                    fill={true}
                    priority={true}
                    sizes='(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw'
                    className='rounded object-cover' 
                />
            </div>
        </div>
    )
}

export default PersonalityConclusion
