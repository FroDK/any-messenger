import Head from 'next/head'
import Sidebar from "../components/Sidebar";

export default function Home({allPostsData}) {
    return (
        <div>
            <Head>
                <title>Any Messenger</title>
            </Head>
            <Sidebar/>
        </div>
    )
}
