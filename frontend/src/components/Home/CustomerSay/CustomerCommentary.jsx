import React from 'react'

const CustomerCommentary = () => {
    return (
    <>
        <div data-aos="fadeInUp">
            <div className="text-lg font-semibold flex items-start">
                <img src="/icon/quote.svg" alt="quote" className="w-6 h-6" />
                <p className="pl-4 text-base">
                    You can't go wrong with Chicken Mandi, I had it twice. The chicken was cooked perfectly, juicy & soft (usually mandi chicken is a bit dry). I would definitely recommend it.
                </p>
            </div>
        </div>

        <div data-aos="slideInUp" className="flex items-center justify-between md:pl-10 sm:pt-14 mt-1  pt-5 pb-3">
            <div className=' w-[90%] border-b-2 border-black'>
                <p className=" font-bebus font-bold text-lg tracking-wider ">Khalid Al Dawsry</p>
                <p className="text-sm font-medium">Jeddah, Saudi</p>
            </div>
            <div className="  pb-2 border-b-4 border-customred">
                <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="customer Photo"
                    className="w-10 h-10 rounded-full"
                />
            </div>
        </div>
    </>

    )
}

export default CustomerCommentary
