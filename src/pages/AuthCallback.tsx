import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from 'src/components/Loading'

const AuthCallback = (): JSX.Element => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/app/dashboard', { replace: true })
  }, [navigate])

  return <Loading message={'Authenticating...'} description={'Please wait while we verify your credentials. 😊'}/>
}

export default AuthCallback
