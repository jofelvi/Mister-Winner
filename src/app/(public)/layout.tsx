import Navbar from "@/components/components/layout/Navbar";
import {Footer} from "@/components/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
 return (
   <>
     <Navbar />
     <main>{children}</main>
     <Footer />
   </>
 )
}
