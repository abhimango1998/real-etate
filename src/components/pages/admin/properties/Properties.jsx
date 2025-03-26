"use client";
import { useRouter } from "next/navigation";

import DashboardPageHeader from "@/components/common/DashboardPageHeader";

const Property = () => {
  const router = useRouter();

  return (
    <div>
      <DashboardPageHeader
        isShowButton={true}
        title={"Properties"}
        btnText={"Add Property"}
        handleClick={() => router.push("/admin/properties/add-property")}
      />
    </div>
  );
};

export default Property;
