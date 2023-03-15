import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router' 
import { XMarkIcon } from '@heroicons/react/24/solid'
import supabase from '../utils/supabase-browser'

const logInNotify = () => toast.success('You have logged in.')
const logInError = () => toast.error('The email or password is not correct.')

interface LogIn {
    setOverlay: any
}

const LogIn = ({ setOverlay }: LogIn) => {
    const initialValues = { email: '', password: '' }
    const initialErrors = { email: '', password: '' }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState(initialErrors)
    const [isDisable, setIsDisable] = useState(false)

    const router = useRouter()

    useEffect(() => {
        setFormErrors(validate(formValues))
        setIsDisable(enable(formValues, formErrors))
    }, [formValues])

    const validate = (values: any) => {
        const errors: any = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (values.email && !emailRegex.test(values.email)) 
            errors.email = 'Please enter a valid email.'
        return errors
    }

    const enable = (values: any, errors: any) => {
        if (values.email !== '' && values.password !== ''
         && Object.keys(errors).length === 0)
            return true
        return false
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
        setFormErrors(validate({ ...formValues, [name]: value })) 
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({
            email: formValues.email,
            password: formValues.password
        })
        if (!error) {
            setOverlay(() => '')
            logInNotify()
        }
        else { 
            logInError()
            setFormValues({ ...formValues, password: '' })
        }
    }

    return (
        <div className='w-screen h-screen md:w-96 md:h-full md:-ml-48 md:-mt-48
                        rounded bg-white'>
            <div className='absolute top-0 right-0 md:-mt-48'>
                <XMarkIcon className='h-7 w-7 mt-1 mr-2 hover:cursor-pointer hover:bg-gray-200'
                       onClick={() => setOverlay('')} />
            </div>
            <form onSubmit={handleSubmit} className='flex flex-col items-center'>
                <div className='mt-4 text-center text-2xl font-semibold text-indigo-600'>AnimeKnowledge</div>
                <div className='mt-1 text-center
                               text-xl font-semibold'>Log In</div>
                <div className='text-center mt-1'>
                    Or <span className='text-indigo-600
                                        hover:text-indigo-400'>
                        <span className='hover:cursor-pointer'
                              onClick={() => setOverlay('signUp')}>sign up</span></span> for an account</div>
                <div className='flex flex-col w-80 h-16 mt-3 text-lg'>
                    <label className='text-base font-medium'>Email</label>
                    <input className='h-8 border p-2 text-base' 
                           type='text' name='email' value={formValues.email} onChange={handleChange} />
                    <p className='text-sm text-red-500'>{formErrors.email}</p>
                </div>
                <div className='flex flex-col w-80 h-16 mt-3 text-lg'>
                    <label className='text-base font-medium'>Password</label>
                    <input className='h-8 border p-2 text-base' 
                           type='password' name='password' value={formValues.password} onChange={handleChange} />
                    <p className='text-sm text-red-500'>{formErrors.password}</p>
                </div>
                <button 
                    className={`w-80 h-10 mt-3 rounded text-white 
                                ${isDisable ? 'bg-indigo-600 hover:bg-indigo-400 hover:cursor-pointer' 
                                            : 'bg-gray-300'}`}
                    disabled={!isDisable}>
                    Log In
                </button>
                <button 
                    onClick={ () => {
                        setOverlay('')
                        router.push('/reset-password')
                     }}
                    className='mt-4 text-sm text-indigo-600 underline
                                hover:cursor-pointer'>Forget your password?</button>
                <div className='w-80 mt-4 mb-4 text-sm'>
                    By signing in, you are agreeing to the  
                    <span className='text-indigo-600 hover:text-indigo-400'><a href='https://www.kuizme.com/terms-of-service'
                    target='_blank'> Terms of Conditions </a></span> and 
                    <span className='text-indigo-600 hover:text-indigo-400'><a href='https://www.kuizme.com/privacy'
                    target='_blank'> Privacy Policy</a></span>.
                </div>
                <Toaster />
            </form>
        </div>
    )
}

export default LogIn
