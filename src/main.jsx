import {createRoot} from 'react-dom/client'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/inter'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import './styles.css'
import {Provider} from './store'
import App from './App'
createRoot(document.getElementById('root')).render(<Provider><App/></Provider>)
