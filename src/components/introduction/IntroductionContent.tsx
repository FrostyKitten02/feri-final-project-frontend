import { Link } from "react-router-dom";
import Paths from "../../util/Paths";

export default function IntroductionContent() {
  return (
    <div className="flex flex-row px-10">
      <div className="flex flex-col w-2/5 h-screen justify-center items-center text-6xl space-y-24 font-bold">
        <h1>Hero Text 1</h1>
        <h1>Hero Text 2</h1>
        <h1>Hero Text 3</h1>
      </div>
      <div className="flex flex-col w-3/5 h-screen justify-center items-center space-y-10">
        <div className="">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </div>
        <div className="">
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
          ea voluptate velit esse quam nihil molestiae consequatur, vel illum
          qui dolorem eum fugiat quo voluptas nulla pariatur?"
        </div>
        <Link to={Paths.SIGN_UP} className="w-1/2">
          <div className="p-4 bg-black text-white flex justify-center rounded-lg font-semibold">
            Sign Up
          </div>
        </Link>
      </div>
    </div>
  );
}
