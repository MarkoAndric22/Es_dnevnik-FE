import { useRouteError } from "react-router-dom";

const SubjectError = () => {
    const error = useRouteError();
    return <div>
        <h1>Greška!</h1>
        <p>Nismo bili u stanju da preuzmemo tražen predmet</p>
        <p>
            {error.status === 404 ? "Traženi predmet ne postoji" : "Interna greška sa oznakom: " + error.message}
        </p>
    </div>
}

export default SubjectError;