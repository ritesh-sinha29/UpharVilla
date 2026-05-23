import HeroSlider from "@/modules/user/components/HeroSlider";
import Features from "@/modules/user/components/Features";
import NewArrival from "@/modules/user/components/NewArrival";
import Trending from "@/modules/user/components/Trending";
import EditorialSlider from "@/modules/user/components/EditorialSlider";
import ShopByPrice from "@/modules/user/components/ShopByPrice";
import CustomGift from "@/modules/user/components/CustomGift";
import Testimonials from "@/modules/user/components/Testimonials";
import Footer from "@/modules/user/components/Footer";
import Categories from "@/modules/user/components/Categories";

const HomePage = () => {
  return (
    <div className="mt-6">
      <div className="">
        <HeroSlider />
        <Categories />
        <Features />
        <NewArrival />
        <EditorialSlider />
        <Trending />
        <div className="w-full bg-white px-8 my-10 relative overflow-hidden">
          <ShopByPrice />
          <CustomGift />
        </div>
        <Testimonials />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
