import { headers } from "next/headers";
import ClientPage from "./ClientPage";
import { getUserData } from "./api/API";



// ✅ Серверный компонент, загружает дефолтного юзера и проверяет мобильный браузер
export default async function Page() {

  // проверяем мобильный браузер
  const userAgent = (await headers()).get("user-agent") || "";
  const isMobile = /Mobi|Android/i.test(userAgent);
  // дефолтный юзер
  const initialUser = await getUserData("NKT-FRLV"); 

  return <ClientPage initialUser={initialUser} isMobile={isMobile} />;
}
