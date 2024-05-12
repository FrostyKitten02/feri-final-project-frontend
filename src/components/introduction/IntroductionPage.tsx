import {SignedIn, SignedOut} from "@clerk/clerk-react";
import {Navigate} from "react-router-dom";
import Paths from "../../util/Paths";
import IntroductionHeader from "./IntroductionHeader";
import IntroductionContent from "./IntroductionContent";

function IntroductionPage() {
  return (
    <div className="flex flex-col h-screen overflow-auto bg-gradient-to-r from-bg_placeholder1 to-bg_placeholder2">
      <SignedOut>
        <IntroductionHeader />
        <IntroductionContent />
      </SignedOut>
      <SignedIn>
        <Navigate to={Paths.HOME} replace={true} />
      </SignedIn>
    </div>
  );
}

export default IntroductionPage;
