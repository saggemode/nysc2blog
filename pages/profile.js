import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styles from "@/styles/styles";
import Fade from "react-reveal/Fade";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import ProfileContent from "@/components/Profile/ProfileContent";

function Profile() {
  const { session } = useSession();
  const [active, setActive] = useState(1);

  return (
    <>
      <Head>
        <title>Radon | Profile</title>
      </Head>
      <div>
        <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
          <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 ">
            <ProfileSidebar active={active} setActive={setActive} />
          </div>
          <ProfileContent active={active} />
        </div>
      </div>
    </>
  );
}

Profile.auth = true;

export default Profile;
