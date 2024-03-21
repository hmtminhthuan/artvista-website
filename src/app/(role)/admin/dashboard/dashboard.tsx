import Guard from "@/components/Guard";
import Layout from "@/components/Layout";
import useAuth from "@/hooks/useAuth";

const Dashboard: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <Layout>
            <h3>Dashboard</h3>
            <button style={{ backgroundColor: 'purple', color: 'white',  }} onClick={() => {
                logout()
            }}>Log out</button>
        </Layout>
    )
}

export default Guard(Dashboard);
