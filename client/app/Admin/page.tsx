
import LoginForm from "./adminAuth/login/page"


export default function AdminPage () {

    return(
        <main className="p-6">
            <h1>hello this is admin pannel</h1>
            <div>
                <LoginForm/>
            </div>
        </main>
    )
}