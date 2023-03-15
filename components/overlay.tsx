import LogIn from './login'
import SignUp from './signup'

interface Overlay {
    overlay: any,
    setOverlay: any
}

const Overlay = ({ overlay, setOverlay }: Overlay) => {
    return (
        <>
        <div className='absolute md:top-1/2 md:left-1/2 z-50'>
            { overlay === 'logIn' && <LogIn  setOverlay={setOverlay} /> }
            { overlay === 'signUp' && <SignUp setOverlay={setOverlay} /> }
        </div>
        { (overlay === 'logIn' || overlay === 'signUp' ||overlay === 'convinceSignUp') &&
            <div className='absolute w-screen h-screen bg-black opacity-70 z-40'></div> }
        </>
    )
}

export default Overlay
