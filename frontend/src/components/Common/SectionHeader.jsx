import React from 'react'

const SectionHeader = ({ inspirationWord, title }) => {
    return (
        <div data-aos="fadeIn">
            <p className=" font-poppins text-sm mb-2 mt-7 text-customred font-bold ">
                <span className="md:text-xl text-sm mr-3 text-nowrap">&#x25A0;
                </span>{inspirationWord}
            </p>
            <h1 className="text-3xl font-bebus">{title}
            </h1>
        </div>
    )
}

export default SectionHeader
