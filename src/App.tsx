import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import CoursesList from './features/courses/CoursesList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditCourse from './features/courses/EditCourse'
import NewCourse from './features/courses/NewCourse'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import useTitle from './hooks/useTitle'
import CongruencePage from './features/Arithmetics/Congruence/CongruencePage'
import EuclideanPage from './features/Arithmetics/Euclidean/EuclideanPage'
import NumerationPage from './features/Arithmetics/Numeration/NumerationPage'
import PGCDPage from './features/Arithmetics/PGCD/PGCDPage'
import PasAPasCongruence from './features/Arithmetics/Congruence/PasAPasCongruence'
import   PowerCongruenceStepper   from './features/Arithmetics/Congruence/PowerCongruenceStepper'
import EquivalenceClassVerifier  from './features/Arithmetics/Congruence/EquivalenceClassVerifier'
import { InverseModuloStepper } from './features/Arithmetics/Congruence/InverseModuloStepper'
import { ModularEquationStepper } from './features/Arithmetics/Congruence/ModularEquationStepper'
import FermatMethodsStepper from './features/Arithmetics/Congruence/Fermat/FermatMethodsStepper'
import CongruenceProofStepper from './features/Arithmetics/Congruence/Proofs/CongruenceProofStepper'
import ModularEquationMultiStepper from './features/Arithmetics/Congruence/EquationModular/ModularEquationMultiStepper'
import ClassModuloMultiStepper from './features/Arithmetics/Congruence/ClassModulo/ClassModuloMultiStepper'
import { PPCDMethodSwitcher } from './features/Arithmetics/PGCD/pgcd/PPCDMethodSwitcher'
import { BezoutModule } from './features/Arithmetics/PGCD/Bezout/BezoutModule'
import ArithmeticsMother from './features/Arithmetics/PGCD/Gauss/ArithmeticsMother'
import  DiophantienneEquation  from './features/Arithmetics/PGCD/Diophantienne/DiophantienneEquation'
import { MultiBaseOperationSimulator } from './features/Arithmetics/Numeration/MultiBaseOperationSimulator'
import ConverterSimulator from './features/Arithmetics/Numeration/ConverterSimulator'
import EuclideanDivisionPanelUnified from './features/Arithmetics/Euclidean/EuclideanDivisionPanelUnified'
import DifferenceSquaresChakraV3Tutor from './features/Arithmetics/Euclidean/divisibility/DifferenceSquaresChakraV3Tutor'
import DivisionReajustementMixte from './features/Arithmetics/Euclidean/DivisionReajustementMixte'
import DisjonctionDeCasTutor from './features/Arithmetics/Euclidean/divisibility/DisjonctionDeCasTutor'


function App() {
  useTitle('Siram@th')

  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Encadreur, ROLES.Administrateur]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                 </Route>
                 
                  <Route path="courses">
                    <Route index element={<CoursesList />} />
                    <Route path=":id" element={<EditCourse />} />
                    <Route path="new" element={<NewCourse />} />

                    {/* Arithmetics */}
                     {/* Euclidean */}
                    <Route path="euclidean" element={<EuclideanPage />} />
                    <Route path="euclidean/identite" element={<EuclideanDivisionPanelUnified />} />
                     <Route path="euclidean/nonconforme" element={<DivisionReajustementMixte />} />
                    <Route path="euclidean/resolution" element={<DifferenceSquaresChakraV3Tutor />} />
                    <Route path="euclidean/disjonctiondecas" element={<DisjonctionDeCasTutor />} />
                    
                     {/* Numeration */}
                    <Route path="numeration" element={<NumerationPage />} />
                    <Route path="numeration/operations" element={<MultiBaseOperationSimulator />} />
                    <Route path="numeration/conversiondebase" element={<ConverterSimulator />} />
                   
                    {/* Congruence */}
                    <Route path="congruence" element={<CongruencePage />} />
                    <Route path="congruence/simple" element={<PasAPasCongruence />} />
                    <Route path="congruence/proof" element={<CongruenceProofStepper />} />
                    <Route path="congruence/eqmodulaire" element={<ModularEquationStepper />} />
                    <Route path="congruence/modular-equation" element={<ModularEquationMultiStepper />} />
                    <Route path="congruence/periodicite" element={<PowerCongruenceStepper />} />
                    <Route path="congruence/classModulon" element={<EquivalenceClassVerifier />} />
                     <Route path="congruence/classmodulo" element={<ClassModuloMultiStepper />} />
                     <Route path="congruence/inversemodulon" element={<InverseModuloStepper />} />
                    <Route path="congruence/fermatmethods" element={<FermatMethodsStepper />} />

                    {/*pgcd*/}
                    <Route path="pgcd" element={<PGCDPage />} />
                    <Route path="pgcd/gcdcalculate" element={<PPCDMethodSwitcher />} />
                    <Route path="pgcd/bezout" element={<BezoutModule />} />
                    <Route path="pgcd/divisibility" element={<ArithmeticsMother />} />
                    <Route path="pgcd/diophantienne" element={<DiophantienneEquation />} />
                    
                   
                  </Route>
               
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
