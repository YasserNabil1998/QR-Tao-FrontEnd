import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDirection } from "../../../context/DirectionContext";
import { SkeletonCard } from "../../../components/common/Skeleton";

interface Restaurant {
    id: string;
    name: string;
    description: string;
    cuisine_type: string;
    category: string;
    location: string;
    rating: number;
    total_reviews: number;
    image_url: string;
    is_active: boolean;
    phone: string;
    opening_hours: string;
}

const RestaurantsList = () => {
    const { direction } = useDirection();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Mock data for demonstration
    const mockRestaurants: Restaurant[] = [
        {
            id: "1",
            name: "مطعم الأصالة",
            description: "أشهى الأطباق العربية التقليدية مع لمسة عصرية",
            cuisine_type: "مطعم",
            category: "Restaurant",
            location: "الرياض، حي الملز",
            rating: 4.8,
            total_reviews: 245,
            image_url:
                "https://readdy.ai/api/search-image?query=Traditional%20Arabic%20restaurant%20interior%20with%20authentic%20Middle%20Eastern%20decor%2C%20warm%20lighting%2C%20traditional%20seating%2C%20elegant%20dining%20atmosphere%2C%20cultural%20heritage%20design%2C%20simple%20clean%20background&width=400&height=300&seq=restaurant-1&orientation=landscape",
            is_active: true,
            phone: "+966501234567",
            opening_hours: "11:00 ص - 12:00 م",
        },
        {
            id: "2",
            name: "بيتزا نابولي",
            description: "بيتزا إيطالية أصيلة بأجود المكونات الطازجة",
            cuisine_type: "مطعم",
            category: "Restaurant",
            location: "جدة، كورنيش البحر",
            rating: 4.6,
            total_reviews: 189,
            image_url:
                "https://readdy.ai/api/search-image?query=Modern%20Italian%20pizzeria%20restaurant%20interior%2C%20wood-fired%20oven%2C%20contemporary%20design%2C%20cozy%20dining%20atmosphere%2C%20authentic%20Italian%20restaurant%20ambiance%2C%20simple%20clean%20background&width=400&height=300&seq=restaurant-2&orientation=landscape",
            is_active: true,
            phone: "+966502345678",
            opening_hours: "12:00 ظ - 11:00 م",
        },
        {
            id: "3",
            name: "كلاود كيتشن الشرق",
            description: "مطبخ سحابي متخصص في التوصيل السريع للوجبات الطازجة",
            cuisine_type: "مطبخ سحابي",
            category: "Restaurant",
            location: "الرياض، حي العليا",
            rating: 4.7,
            total_reviews: 156,
            image_url:
                "https://readdy.ai/api/search-image?query=Modern%20cloud%20kitchen%20interior%2C%20professional%20cooking%20equipment%2C%20delivery%20focused%20setup%2C%20efficient%20workspace%2C%20contemporary%20commercial%20kitchen%20design%2C%20simple%20clean%20background&width=400&height=300&seq=restaurant-3&orientation=landscape",
            is_active: true,
            phone: "+966503456789",
            opening_hours: "10:00 ص - 2:00 ص",
        },
        {
            id: "4",
            name: "كافيه الحرمين",
            description:
                "قهوة عربية أصيلة مع الحلويات الشرقية والأجواء الهادئة",
            cuisine_type: "مقهى",
            category: "Restaurant",
            location: "مكة المكرمة، العزيزية",
            rating: 4.7,
            total_reviews: 198,
            image_url:
                "https://readdy.ai/api/search-image?query=Traditional%20Arabic%20coffee%20shop%20interior%2C%20authentic%20Middle%20Eastern%20cafe%20design%2C%20warm%20cozy%20atmosphere%2C%20traditional%20seating%2C%20cultural%20heritage%20style%2C%20simple%20clean%20background&width=400&height=300&seq=cafe-1&orientation=landscape",
            is_active: true,
            phone: "+966504567890",
            opening_hours: "6:00 ص - 12:00 م",
        },
        {
            id: "5",
            name: "مطعم فندق الريتز",
            description: "تجربة طعام فاخرة في أجواء الضيافة الراقية",
            cuisine_type: "مطعم الفندق",
            category: "Restaurant",
            location: "الرياض، حي الملك عبدالله المالي",
            rating: 4.9,
            total_reviews: 267,
            image_url:
                "https://readdy.ai/api/search-image?query=Luxury%20hotel%20restaurant%20interior%2C%20elegant%20fine%20dining%20atmosphere%2C%20sophisticated%20decor%2C%20premium%20hospitality%20design%2C%20upscale%20dining%20experience%2C%20simple%20clean%20background&width=400&height=300&seq=hotel-restaurant-1&orientation=landscape",
            is_active: true,
            phone: "+966505678901",
            opening_hours: "6:00 ص - 12:00 م",
        },
        {
            id: "6",
            name: "برجر ستيشن",
            description: "وجبات سريعة شهية مع البرجر والبطاطس المقرمشة",
            cuisine_type: "الوجبات السريعة",
            category: "Restaurant",
            location: "جدة، حي الروضة",
            rating: 4.4,
            total_reviews: 312,
            image_url:
                "https://readdy.ai/api/search-image?query=Modern%20fast%20food%20restaurant%20interior%2C%20burger%20station%2C%20quick%20service%20setup%2C%20contemporary%20casual%20dining%2C%20efficient%20kitchen%20design%2C%20simple%20clean%20background&width=400&height=300&seq=fast-food-1&orientation=landscape",
            is_active: true,
            phone: "+966506789012",
            opening_hours: "11:00 ص - 2:00 ص",
        },
        {
            id: "7",
            name: "حلويات الملكة",
            description: "أشهى الحلويات الشرقية والغربية مع الكيك والمعجنات",
            cuisine_type: "مخبز حلويات",
            category: "Restaurant",
            location: "الدمام، حي الفيصلية",
            rating: 4.9,
            total_reviews: 456,
            image_url:
                "https://readdy.ai/api/search-image?query=Elegant%20dessert%20bakery%20interior%2C%20display%20cases%20with%20sweets%2C%20pastry%20counter%2C%20luxurious%20atmosphere%2C%20warm%20lighting%2C%20bakery%20showcase%2C%20simple%20clean%20background&width=400&height=300&seq=dessert-bakery-1&orientation=landscape",
            is_active: true,
            phone: "+966507890123",
            opening_hours: "8:00 ص - 12:00 م",
        },
        {
            id: "8",
            name: "بيتزا إكسبرس",
            description: "متجر متخصص في البيتزا الطازجة بأنواعها المختلفة",
            cuisine_type: "متجر بيتزا",
            category: "Restaurant",
            location: "الرياض، حي النرجس",
            rating: 4.5,
            total_reviews: 234,
            image_url:
                "https://readdy.ai/api/search-image?query=Specialized%20pizza%20shop%20interior%2C%20wood-fired%20pizza%20oven%2C%20pizza%20preparation%20counter%2C%20Italian%20style%20design%2C%20authentic%20pizzeria%20atmosphere%2C%20simple%20clean%20background&width=400&height=300&seq=pizza-shop-1&orientation=landscape",
            is_active: true,
            phone: "+966508901234",
            opening_hours: "12:00 ظ - 12:00 م",
        },
        {
            id: "9",
            name: "مخبز الصباح",
            description: "خبز طازج يومياً مع المعجنات والحلويات المنزلية",
            cuisine_type: "مخبز",
            category: "Restaurant",
            location: "جدة، حي الحمراء",
            rating: 4.6,
            total_reviews: 189,
            image_url:
                "https://readdy.ai/api/search-image?query=Traditional%20bakery%20interior%2C%20fresh%20bread%20display%2C%20baking%20ovens%2C%20warm%20atmosphere%2C%20artisan%20bakery%20design%2C%20flour%20and%20dough%20workspace%2C%20simple%20clean%20background&width=400&height=300&seq=bakery-1&orientation=landscape",
            is_active: true,
            phone: "+966509012345",
            opening_hours: "5:00 ص - 10:00 م",
        },
        {
            id: "10",
            name: "شاحنة الطعم الأصيل",
            description: "شاحنة طعام متنقلة تقدم أشهى الوجبات في مواقع مختلفة",
            cuisine_type: "شاحنة طعام",
            category: "Restaurant",
            location: "الرياض، مواقع متنقلة",
            rating: 4.3,
            total_reviews: 167,
            image_url:
                "https://readdy.ai/api/search-image?query=Modern%20food%20truck%20interior%2C%20mobile%20kitchen%20setup%2C%20compact%20cooking%20space%2C%20street%20food%20preparation%2C%20efficient%20mobile%20restaurant%20design%2C%20simple%20clean%20background&width=400&height=300&seq=food-truck-1&orientation=landscape",
            is_active: true,
            phone: "+966510123456",
            opening_hours: "11:00 ص - 11:00 م",
        },
        {
            id: "11",
            name: "فواكه الطبيعة",
            description: "متجر فواكه طازجة وعصائر طبيعية مع خضروات عضوية",
            cuisine_type: "متجر فواكه",
            category: "Restaurant",
            location: "الدمام، السوق المركزي",
            rating: 4.8,
            total_reviews: 298,
            image_url:
                "https://readdy.ai/api/search-image?query=Fresh%20fruit%20store%20interior%2C%20colorful%20fruit%20displays%2C%20natural%20produce%20market%2C%20healthy%20food%20atmosphere%2C%20organic%20fruits%20and%20vegetables%2C%20simple%20clean%20background&width=400&height=300&seq=fruit-store-1&orientation=landscape",
            is_active: true,
            phone: "+966511234567",
            opening_hours: "6:00 ص - 11:00 م",
        },
        {
            id: "12",
            name: "مطعم البحر الأزرق",
            description: "أطباق المأكولات البحرية الطازجة والشهية",
            cuisine_type: "مطعم",
            category: "Restaurant",
            location: "جدة، الكورنيش الشمالي",
            rating: 4.5,
            total_reviews: 267,
            image_url:
                "https://readdy.ai/api/search-image?query=Elegant%20seafood%20restaurant%20interior%2C%20nautical%20theme%2C%20ocean%20view%20dining%2C%20contemporary%20coastal%20restaurant%20design%2C%20fresh%20seafood%20atmosphere%2C%20simple%20clean%20background&width=400&height=300&seq=restaurant-4&orientation=landscape",
            is_active: true,
            phone: "+966512345678",
            opening_hours: "12:00 ظ - 11:30 م",
        },
        {
            id: "13",
            name: "كلاود كيتشن الغرب",
            description: "مطبخ سحابي متطور للطلبات الإلكترونية والتوصيل السريع",
            cuisine_type: "مطبخ سحابي",
            category: "Restaurant",
            location: "جدة، حي الزهراء",
            rating: 4.6,
            total_reviews: 145,
            image_url:
                "https://readdy.ai/api/search-image?query=Advanced%20cloud%20kitchen%20facility%2C%20high-tech%20cooking%20equipment%2C%20delivery%20optimization%20setup%2C%20modern%20commercial%20kitchen%2C%20digital%20ordering%20system%2C%20simple%20clean%20background&width=400&height=300&seq=cloud-kitchen-2&orientation=landscape",
            is_active: true,
            phone: "+966513456789",
            opening_hours: "9:00 ص - 1:00 ص",
        },
        {
            id: "14",
            name: "كافيه سبيشالتي",
            description: "قهوة مختصة عالية الجودة مع أجواء عصرية مريحة",
            cuisine_type: "مقهى",
            category: "Restaurant",
            location: "الرياض، حي التحلية",
            rating: 4.8,
            total_reviews: 223,
            image_url:
                "https://readdy.ai/api/search-image?query=Modern%20specialty%20coffee%20shop%20interior%2C%20professional%20coffee%20equipment%2C%20minimalist%20design%2C%20industrial%20elements%2C%20cozy%20atmosphere%2C%20simple%20clean%20background&width=400&height=300&seq=cafe-2&orientation=landscape",
            is_active: true,
            phone: "+966514567890",
            opening_hours: "7:00 ص - 11:00 م",
        },
        {
            id: "15",
            name: "مطعم فندق الفيصلية",
            description: "مطعم فندقي راقي يقدم المأكولات العالمية الفاخرة",
            cuisine_type: "مطعم الفندق",
            category: "Restaurant",
            location: "الرياض، برج الفيصلية",
            rating: 4.9,
            total_reviews: 189,
            image_url:
                "https://readdy.ai/api/search-image?query=Premium%20hotel%20restaurant%20interior%2C%20international%20cuisine%20setup%2C%20luxury%20dining%20atmosphere%2C%20five-star%20hospitality%20design%2C%20elegant%20fine%20dining%2C%20simple%20clean%20background&width=400&height=300&seq=hotel-restaurant-2&orientation=landscape",
            is_active: true,
            phone: "+966515678901",
            opening_hours: "6:00 ص - 1:00 ص",
        },
        {
            id: "16",
            name: "فاست بايت",
            description: "سلسلة وجبات سريعة مع قائمة متنوعة وخدمة سريعة",
            cuisine_type: "الوجبات السريعة",
            category: "Restaurant",
            location: "الدمام، حي الشاطئ",
            rating: 4.2,
            total_reviews: 278,
            image_url:
                "https://readdy.ai/api/search-image?query=Modern%20fast%20food%20chain%20interior%2C%20quick%20service%20counter%2C%20efficient%20kitchen%20layout%2C%20contemporary%20fast%20casual%20design%2C%20speed-focused%20restaurant%2C%20simple%20clean%20background&width=400&height=300&seq=fast-food-2&orientation=landscape",
            is_active: true,
            phone: "+966516789012",
            opening_hours: "10:00 ص - 2:00 ص",
        },
        {
            id: "17",
            name: "حلويات الشام",
            description: "مخبز حلويات شامية أصيلة مع الكنافة والمعمول",
            cuisine_type: "مخبز حلويات",
            category: "Restaurant",
            location: "الرياض، حي الورود",
            rating: 4.7,
            total_reviews: 334,
            image_url:
                "https://readdy.ai/api/search-image?query=Traditional%20Middle%20Eastern%20dessert%20bakery%2C%20authentic%20sweets%20display%2C%20oriental%20pastries%2C%20cultural%20heritage%20design%2C%20warm%20inviting%20atmosphere%2C%20simple%20clean%20background&width=400&height=300&seq=dessert-bakery-2&orientation=landscape",
            is_active: true,
            phone: "+966517890123",
            opening_hours: "9:00 ص - 12:00 م",
        },
        {
            id: "18",
            name: "بيتزا كورنر",
            description: "متجر بيتزا سريع مع وصفات إيطالية أصيلة",
            cuisine_type: "متجر بيتزا",
            category: "Restaurant",
            location: "جدة، حي الأندلس",
            rating: 4.4,
            total_reviews: 156,
            image_url:
                "https://readdy.ai/api/search-image?query=Corner%20pizza%20shop%20interior%2C%20authentic%20Italian%20pizza%20oven%2C%20quick%20service%20setup%2C%20traditional%20pizzeria%20design%2C%20casual%20dining%20atmosphere%2C%20simple%20clean%20background&width=400&height=300&seq=pizza-shop-2&orientation=landscape",
            is_active: true,
            phone: "+966518901234",
            opening_hours: "11:00 ص - 1:00 ص",
        },
        {
            id: "19",
            name: "مخبز الأرياف",
            description: "مخبز تقليدي يقدم الخبز البلدي والمعجنات الطازجة",
            cuisine_type: "مخبز",
            category: "Restaurant",
            location: "الرياض، حي النسيم",
            rating: 4.5,
            total_reviews: 267,
            image_url:
                "https://readdy.ai/api/search-image?query=Traditional%20countryside%20bakery%20interior%2C%20rustic%20bread%20ovens%2C%20artisan%20baking%20setup%2C%20homestyle%20atmosphere%2C%20authentic%20bakery%20design%2C%20simple%20clean%20background&width=400&height=300&seq=bakery-2&orientation=landscape",
            is_active: true,
            phone: "+966519012345",
            opening_hours: "4:00 ص - 9:00 م",
        },
        {
            id: "20",
            name: "شاحنة البرجر المتنقلة",
            description: "شاحنة طعام متخصصة في البرجر الطازج والبطاطس",
            cuisine_type: "شاحنة طعام",
            category: "Restaurant",
            location: "جدة، مواقع متنقلة",
            rating: 4.1,
            total_reviews: 134,
            image_url:
                "https://readdy.ai/api/search-image?query=Burger%20food%20truck%20interior%2C%20mobile%20grill%20setup%2C%20compact%20burger%20kitchen%2C%20street%20food%20atmosphere%2C%20efficient%20mobile%20cooking%20space%2C%20simple%20clean%20background&width=400&height=300&seq=food-truck-2&orientation=landscape",
            is_active: true,
            phone: "+966520123456",
            opening_hours: "12:00 ظ - 12:00 م",
        },
        {
            id: "21",
            name: "فواكه الخليج",
            description: "متجر فواكه استوائية ومحلية مع عصائر طبيعية",
            cuisine_type: "متجر فواكه",
            category: "Restaurant",
            location: "الدمام، حي الفردوس",
            rating: 4.6,
            total_reviews: 198,
            image_url:
                "https://readdy.ai/api/search-image?query=Tropical%20fruit%20market%20interior%2C%20exotic%20fruits%20display%2C%20fresh%20juice%20bar%2C%20vibrant%20colorful%20atmosphere%2C%20healthy%20food%20store%20design%2C%20simple%20clean%20background&width=400&height=300&seq=fruit-store-2&orientation=landscape",
            is_active: true,
            phone: "+966521234567",
            opening_hours: "7:00 ص - 10:00 م",
        },
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setRestaurants(mockRestaurants);
            setLoading(false);
        }, 1000);
    }, []);

    const categories = [
        { id: "all", name: "جميع الأنواع", icon: "ri-apps-line" },
        { id: "مطعم", name: "مطعم", icon: "ri-restaurant-line" },
        { id: "مطبخ سحابي", name: "مطبخ سحابي", icon: "ri-cloud-line" },
        { id: "مقهى", name: "مقهى", icon: "ri-cup-line" },
        { id: "مطعم الفندق", name: "مطعم الفندق", icon: "ri-hotel-line" },
        {
            id: "الوجبات السريعة",
            name: "الوجبات السريعة",
            icon: "ri-takeaway-line",
        },
        { id: "مخبز حلويات", name: "مخبز حلويات", icon: "ri-cake-3-line" },
        { id: "متجر بيتزا", name: "متجر بيتزا", icon: "ri-restaurant-2-line" },
        { id: "مخبز", name: "مخبز", icon: "ri-cake-line" },
        { id: "شاحنة طعام", name: "شاحنة طعام", icon: "ri-truck-line" },
        { id: "متجر فواكه", name: "متجر فواكه", icon: "ri-plant-line" },
    ];

    const filteredRestaurants = restaurants.filter((restaurant) => {
        return (
            selectedCategory === "all" ||
            restaurant.cuisine_type === selectedCategory
        );
    });

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <i key={i} className="ri-star-fill text-yellow-400"></i>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <i key="half" className="ri-star-half-fill text-yellow-400"></i>
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <i
                    key={`empty-${i}`}
                    className="ri-star-line text-gray-300"
                ></i>
            );
        }

        return stars;
    };

    return (
        <section className="py-20 bg-gradient-to-br from-orange-50 to-secondary-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#1B6EF3] to-[#3EB5EA] rounded-full text-white text-2xl font-bold mb-6">
                        <i className="ri-store-line"></i>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        الشركاء المميزون
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        اكتشف مجموعة متنوعة من المطاعم والمتاجر والخدمات التي
                        تستخدم نظام QTap لتقديم تجربة رقمية مميزة
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                                selectedCategory === category.id
                                    ? "bg-orange-500 text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-200"
                            }`}
                        >
                            <i
                                className={`${category.icon} ${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-5 h-5 flex items-center justify-center`}
                            ></i>
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {/* Restaurants Grid */}
                {!loading && (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        data-product-shop
                    >
                        {filteredRestaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
                            >
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={restaurant.image_url}
                                        alt={restaurant.name}
                                        className="w-full h-56 object-cover object-top"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                restaurant.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {restaurant.is_active
                                                ? "مفتوح"
                                                : "مغلق"}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {restaurant.cuisine_type}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[3rem] flex items-center">
                                        {restaurant.name}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
                                        {restaurant.description}
                                    </p>

                                    <div className="flex items-center mb-3 min-h-[1.5rem]">
                                        <div className={`flex items-center ${direction === 'rtl' ? 'space-x-1 space-x-reverse' : 'space-x-1'}`}>
                                            {renderStars(restaurant.rating)}
                                        </div>
                                        <span className={`text-gray-600 text-sm ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}>
                                            {restaurant.rating} (
                                            {restaurant.total_reviews} تقييم)
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4 flex-grow">
                                        <div className="flex items-center text-gray-600 text-sm min-h-[1.5rem]">
                                            <i className={`ri-map-pin-line ${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-4 h-4 flex items-center justify-center flex-shrink-0`}></i>
                                            <span className="truncate">
                                                {restaurant.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm min-h-[1.5rem]">
                                            <i className={`ri-time-line ${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-4 h-4 flex items-center justify-center flex-shrink-0`}></i>
                                            <span>
                                                {restaurant.opening_hours}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm min-h-[1.5rem]">
                                            <i className={`ri-phone-line ${direction === 'rtl' ? 'ml-2' : 'mr-2'} w-4 h-4 flex items-center justify-center flex-shrink-0`}></i>
                                            <span>{restaurant.phone}</span>
                                        </div>
                                    </div>

                                    <div className={`flex ${direction === 'rtl' ? 'space-x-3 space-x-reverse' : 'space-x-3'} mt-auto pt-4`}>
                                        {restaurant.cuisine_type === "مطعم" ||
                                        restaurant.cuisine_type === "مقهى" ||
                                        restaurant.cuisine_type ===
                                            "مطعم الفندق" ||
                                        restaurant.cuisine_type ===
                                            "الوجبات السريعة" ||
                                        restaurant.cuisine_type ===
                                            "متجر بيتزا" ||
                                        restaurant.cuisine_type ===
                                            "شاحنة طعام" ? (
                                            <Link
                                                to={`/menu?restaurant=${restaurant.id}&table=1`}
                                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center justify-center"
                                            >
                                                <i className={`ri-restaurant-line ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`}></i>
                                                عرض المنيو
                                            </Link>
                                        ) : (
                                            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center">
                                                <i className={`ri-shopping-cart-line ${direction === 'rtl' ? 'ml-1' : 'mr-1'}`}></i>
                                                تسوق الآن
                                            </button>
                                        )}
                                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center w-12 h-12 flex-shrink-0">
                                            <i className="ri-heart-line w-5 h-5 flex items-center justify-center"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredRestaurants.length === 0 && (
                    <div className="text-center py-12">
                        <i className="ri-store-line text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            لا توجد نتائج في هذه الفئة
                        </h3>
                        <p className="text-gray-500">
                            جرب اختيار فئة أخرى أو تصفح جميع الشركاء
                        </p>
                    </div>
                )}

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-[#1B6EF3] to-[#3EB5EA] rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            هل تريد الانضمام كشريك؟
                        </h3>
                        <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                            انضم إلى شبكة الشركاء الرائدة واستفد من نظام QTap
                            لتحسين تجربة عملائك وزيادة مبيعاتك
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap"
                        >
                            <i className={`ri-add-line ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}></i>
                            سجل نشاطك الآن
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RestaurantsList;
