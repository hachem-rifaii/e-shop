import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../style/style'
import { useSelector } from 'react-redux'
import { Country, State } from "country-state-city"
import { server } from '../../server'
import axios from 'axios'
import { toast } from 'react-toastify'


const Checkout = () => {

    const { user } = useSelector((state) => state.user)
    const { cart } = useSelector((state) => state.cart);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [userInfo, setUserInfo] = useState(false);
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [zipCode, setZipCode] = useState(null);
    const [couponCode, setCouponCode] = useState("");
    const [couponCodeData, setCouponCodeData] = useState(null);
    const [discountPrice, setDiscountPrice] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0)
    })
    const paymentSubmit = () => {
        if (address1 === "" || address2 === "" || zipCode === null || country === "" || city === "") {
            toast.error("Please fill out all required fields!");
        }
        else {
            const shippingAddress = {
                address1,
                address2,
                zipCode,
                country,
                city
            }
            const orderData = {
                cart,
                totalPrice,
                subTotalPrice,
                shipping,
                discountPrice,
                shippingAddress,
                user
            }
            localStorage.setItem('latestorder', JSON.stringify(orderData))
            navigate('/payment')
        }

    }

    const subTotalPrice = cart.reduce((acc, item) => {
        return acc + item.qty * item.discountPrice
    }, 0)
    const shipping = subTotalPrice * 0.1;

    const handleSubmit = async (e) => {
        e.preventDefault()
        const name = couponCode
        await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((response) => {
            const shopId = response.data.couponCode?.shopId;
            const couponCodeValue = response.data.couponCode?.value
            if (response.data.couponCode !== null) {
                const isCouponValid = cart && cart.filter((item) => item.shopId === shopId);
                if (isCouponValid.length === 0) {
                    toast.error("This coupon code is not valid for this shop!");
                    setCouponCodeData("");
                } else {
                    const eligiblePrice = isCouponValid.reduce(
                        (acc, item) => acc + item.qty * item.discountPrice,
                        0
                    )
                    const discountPrice = (
                        (eligiblePrice * couponCodeValue) / 100
                    )
                    setDiscountPrice(discountPrice)
                    setCouponCodeData(response.data.couponCode);
                    setCouponCode("");
                }
            }
            if (response.data.couponCode === null) {
                toast.error("coupon code not found!");
                setCouponCodeData("");
            }
        })
    }
    const discountPercentage = couponCodeData ? discountPrice : "";
    const totalPrice = couponCodeData ? (subTotalPrice + shipping - discountPercentage).toFixed(2) : (subTotalPrice + shipping).toFixed(2);

    return (
        <div className='w-full flex flex-col items-center py-8'>
            <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
                <div className="w-full 800px:w-[65%]">
                    <ShippingInfo user={user}
                        country={country}
                        setCountry={setCountry}
                        city={city}
                        setCity={setCity}
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        address1={address1}
                        setAddress1={setAddress1}
                        address2={address2}
                        setAddress2={setAddress2}
                        zipCode={zipCode}
                        setZipCode={setZipCode}
                    />
                </div>
                <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
                    <CartData
                        handleSubmit={handleSubmit}
                        subTotalPrice={subTotalPrice}
                        shipping={shipping}
                        couponCode={couponCode}
                        discountPercentage={discountPercentage}
                        totalPrice={totalPrice}
                        setCouponCode={setCouponCode}
                    />
                </div>
            </div>
            <div className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`} onClick={paymentSubmit}>
                <h5 className='text-white'>Go to Payment</h5>
            </div>
        </div>
    )
}

// shpping info 

const ShippingInfo = ({ user, country, setCountry, city, setCity, userInfo, setUserInfo, address1, setAddress1, address2, setAddress2, zipCode, setZipCode }) => {

    return (
        <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
            <h5 className="text-[18px] font-[500]">Shipping Address</h5>
            <br />
            <form>
                <div className="w-full flex pb-3">
                    <div className="w-[50%]">
                        <label className="block pb-2">Full Name</label>
                        <input
                            type="text"
                            value={user && user.name}
                            required
                            className={`${styles.input} !w-[95%]`}
                        />
                    </div>
                    <div className="w-[50%]">
                        <label className="block pb-2">Email Address</label>
                        <input
                            type="email"
                            value={user && user.email}
                            required
                            className={`${styles.input}`}
                        />
                    </div>
                </div>

                <div className="w-full flex pb-3">
                    <div className="w-[50%]">
                        <label className="block pb-2">Phone Number</label>
                        <input
                            type="number"
                            required
                            value={user && user.phoneNumber}
                            className={`${styles.input} !w-[95%]`}
                        />
                    </div>
                    <div className="w-[50%]">
                        <label className="block pb-2">Zip Code</label>
                        <input
                            type="number"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            required
                            className={`${styles.input}`}
                        />
                    </div>
                </div>

                <div className="w-full flex pb-3">
                    <div className="w-[50%]">
                        <label className="block pb-2">country</label>
                        <select
                            className="w-[95%] border h-[40px] rounded-[5px]"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <option className="block pb-2" value="">
                                Choose your City
                            </option>
                            {
                                Country && Country.getAllCountries().map((item) => (
                                    <option value={item.isoCode} key={item.isoCode}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="w-[50%]">
                        <label className="block pb-2">City</label>
                        <select
                            className="w-[95%] border h-[40px] rounded-[5px]"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            <option className="block pb-2" value="">
                                Choose your City
                            </option>
                            {
                                State && State.getStatesOfCountry(country).map((item) => (
                                    <option value={item.isoCode} key={item.isoCode}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className="w-full flex pb-3">
                    <div className="w-[50%]">
                        <label className="block pb-2">Address1</label>
                        <input
                            type="address"
                            required
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}

                            className={`${styles.input} !w-[95%]`}
                        />
                    </div>
                    <div className="w-[50%]">
                        <label className="block pb-2">Address2</label>
                        <input
                            type="address"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            required
                            className={`${styles.input}`}
                        />
                    </div>
                </div>

                <div></div>
            </form>
            <h5
                className="text-[18px] cursor-pointer inline-block"
                onClick={() => setUserInfo(!userInfo)}
            >
                Choose From saved address
            </h5>
            {
                userInfo && (
                    <div>
                        {
                            user && user.addresses.map((item, index) => (
                                <div className="w-full flex mt-1">
                                    <input type="checkbox"
                                        className='mr-3'
                                        value={item.addressType}
                                        onClick={() =>
                                            setAddress1(item.address1) ||
                                            setAddress2(item.address2) ||
                                            setZipCode(item.zipCode) ||
                                            setCountry(item.country) ||
                                            setCity(item.city)
                                        }
                                    />
                                    <h2>{item.addressType}</h2>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>


    );
};

// cart data
const CartData = ({ handleSubmit, subTotalPrice, shipping, couponCode, discountPercentage, totalPrice, setCouponCode }) => {
    return (
        <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
                <h5 className="text-[18px] font-[600]">${subTotalPrice}</h5>
            </div>
            <br />
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
                <h5 className="text-[18px] font-[600]">$ {shipping.toFixed(2)}</h5>
            </div>
            <br />
            <div className="flex justify-between border-b pb-3">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
                <h5 className="text-[18px] font-[600]">
                    - {discountPercentage ? "$" + discountPercentage.toString() : null}
                </h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">${totalPrice}</h5>
            <br />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className={`${styles.input} h-[40px] pl-2`}
                    placeholder="Coupoun code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    required
                />
                <input
                    className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
                    required
                    value="Apply code"
                    type="submit"
                />
            </form>
        </div>
    );
};
export default Checkout