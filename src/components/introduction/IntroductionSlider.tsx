import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.css";

export default function IntroductionSlider() {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };
  return (
    <div className="px-20">
      <Slider {...settings}>
        <div className="py-8">
          <div className="flex flex-row">
            <div className="w-1/2 space-y-6 text-white">
              <h1 className="text-2xl font-bold">
                Comprehensive Project Management
              </h1>
              <p className="">
                Create, edit, and manage projects with details like duration,
                budget, and required resource allocation.
              </p>
              <p>
                Organize projects into work packages with assigned team members,
                timelines, and funding structure.
              </p>
              <p>
                View project hierarchies, work package details, and assigned
                employees at a glance
              </p>
            </div>
            <div className="flex justify-center items-center w-1/2">
              <img src="path_to_image_1" alt="SLIKA 1" />
            </div>
          </div>
        </div>
        <div className="py-8">
          <div className="flex flex-row">
            <div className="w-1/2 space-y-6 text-white">
              <h1 className="text-2xl font-bold">
                Resource Allocation and Utilization Tracking
              </h1>
              <p className="">
                Add, modify, and remove employees from projects and work
                packages.
              </p>
              <p>
                Set employee availability limits across projects and within
                specific projects/work packages.
              </p>
              <p>
                Monitor employee workload and utilization rates in real-time.
              </p>
            </div>
            <div className="flex justify-center items-center w-1/2">
              <img src="path_to_image_1" alt="SLIKA 2" />
            </div>
          </div>
        </div>
        <div className="py-8">
          <div className="flex flex-row">
            <div className="w-1/2 space-y-6 text-white">
              <h1 className="text-2xl font-bold">
                Financial Management and Budgeting
              </h1>
              <p className="">
                Set employee pay rates and roles for each project
              </p>
              <p>
                Receive alerts if a project/work package exceeds the planned
                budget or resource allocation
              </p>
              <p>
                Get recommendations for employee assignments based on their pay
                rates
              </p>
            </div>
            <div className="flex justify-center items-center w-1/2">
              <img src="path_to_image_1" alt="SLIKA 3" />
            </div>
          </div>
        </div>
        <div className="py-8">
          <div className="flex flex-row">
            <div className="w-1/2 space-y-6 text-white">
              <h1 className="text-2xl font-bold">
                Visualization and Reporting
              </h1>
              <p className="">
                Utilize Gantt charts and other diagrams to track project
                progress
              </p>
              <p>
                Analyze project performance, timelines, and budget adherence
                through graphical dashboards
              </p>
              <p>
                Compare project metrics, deviations, delays, and budget overruns
                across engagements
              </p>
            </div>
            <div className="flex justify-center items-center w-1/2">
              <img src="path_to_image_1" alt="SLIKA 4" />
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
}
