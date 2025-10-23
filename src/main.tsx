import { Provider as ChakraProvider} from "@/components/ui/provider"
import { Provider as ReduxProvider } from 'react-redux'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}
//import './index.css'
import { store } from '@/app/store'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ReduxProvider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={ <App />}/>
          </Routes>           
        </BrowserRouter>       
      </ChakraProvider>
    </ReduxProvider>
  </StrictMode>,
)
