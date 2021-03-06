import styles from '../styles/Home.module.css'
import { edgeConfig } from '@ory/integrations/next'
import { Configuration, Session, V0alpha2Api } from '@ory/client'
import { AxiosError } from 'axios'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

// Initialize the Ory Kratos SDK which will connect to the
// /api/.ory/ route we created in the previous step.
const kratos = new V0alpha2Api(new Configuration(edgeConfig))

const SignedOut = () => (
  <>
    Get started and{' '}
    <a href={'/api/.ory/self-service/registration/browser'}>
      create an example account
    </a>{' '}
    or <a href={'/api/.ory/self-service/login/browser'}>sign in</a>,{' '}
    <a href={'/api/.ory/self-service/recovery/browser'}>recover your account</a>{' '}
    or{' '}
    <a href={'/api/.ory/self-service/verification/browser'}>
      verify your email address
    </a>
    ! All using open source{' '}
    <a href={'https://github.com/ory/kratos'}>Ory Kratos</a> in minutes with
    just a{' '}
    <a
      href={
        'https://www.ory.sh/login-spa-react-nextjs-authentication-example-api/'
      }
    >
      few lines of code
    </a>
    !
  </>
)

const Home: NextPage = () => {
  // Contains the current session or undefined.
  const [session, setSession] = useState<Session>()

  // The URL we can use to log out.
  const [logoutUrl, setLogoutUrl] = useState<string>()

  // The error message or undefined.
  const [error, setError] = useState<any>()

  useEffect(() => {
    // If the session or error have been loaded, do nothing.
    if (session || error) {
      return
    }

    // Try to load the session.
    kratos
      .toSession()
      .then(({ data: session }) => {
        // Session loaded successfully! Let's set it.
        setSession(session)

        // Since we have a session, we can also get the logout URL.
        return kratos
          .createSelfServiceLogoutFlowUrlForBrowsers()
          .then(({ data }) => {
            setLogoutUrl(data.logout_url)
          })
      })
      .catch((err: AxiosError) => {
        // An error occurred while loading the session or fetching
        // the logout URL. Let's show that!
        setError({
          error: err.toString(),
          data: err.response?.data
        })
      })
  }, [session, error])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {session ? (
            <>
              You are signed in using <a href="https://www.ory.sh/">Ory</a>!
            </>
          ) : (
            <>
              Add Auth to <a href={'https://nextjs.org'}>Next.js</a> with{' '}
              <a href="https://www.ory.sh/">Ory</a>!
            </>
          )}
        </h1>

        <p className={styles.description}>
          {session ? (
            <>
              <a href={'/api/.ory/self-service/settings/browser'}>
                Update your settings
              </a>{' '}
              or{' '}
              <a
                data-testid="logout"
                href={logoutUrl}
                aria-disabled={!logoutUrl}
              >
                sign out
              </a>
              !
            </>
          ) : (
            <SignedOut />
          )}
        </p>

        <div className={styles.grid}>
          <a href="https://www.ory.sh/docs" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn how to add auth* to your Next.js app!</p>
          </a>

          <a href="https://www.ory.sh/docs/kratos" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>
              Find in-depth information about Ory Kratos&apos; features and API.
            </p>
          </a>

          <a
            href="https://www.ory.sh/docs/kratos/quickstart"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>Deploy open source Ory Kratos in seconds</p>
          </a>

          <a href="https://github.com/ory/kratos" className={styles.card}>
            <h2>GitHub &rarr;</h2>
            <p>Check out Ory Kratos on GitHub!</p>
          </a>
        </div>

        {session ? (
          <div className={styles.session}>
            <>
              <p>Find your session details below. </p>
              <pre className={styles.pre + ' ' + styles.code}>
                <code data-testid={'session-content'}>
                  {JSON.stringify(session, null, 2)}
                </code>
              </pre>
            </>
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default Home