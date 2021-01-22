import React, { Component } from 'react';
import Logo from '../images/n.jpg';
import Slide1 from '../images/buy.jpeg';
import Slide2 from '../images/deals.jpeg';
import Slide3 from '../images/work.jpeg';
import Slide4 from '../images/anywhere.jpeg';
import './style.css';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import Typewriter from 'react-simple-typewriter';
import 'react-simple-typewriter/dist/index.css';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption
} from 'reactstrap';
const items = [
    {
        src: Slide1,
        altText: 'Slide 1',
        caption: 'Buy & Sell'
    },
    {
        src: Slide2,
        altText: 'Slide 2',
        caption: 'Get Deals'
    },
    {
        src: Slide3,
        altText: 'Slide 3',
        caption: 'Anything You Do'
    }, {
        src: Slide4,
        altText: 'Slide 4',
        caption: 'Anywhere'
    }
];



var date = new Date()
date.getFullYear()
var year = date.toString()
class Welcome extends Component {
    constructor() {
        super();
        this.state = {
            activeIndex: 0,
            animating: false
        }
    }

    // componentDidMount(){
    //     console.log(date)
    //     console.log(year.slice(10,15))
    // }

    next = () => {
        if (this.state.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }
    previous = () => {
        if (this.state.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });;
    }

    goToIndex = (newIndex) => {
        if (this.state.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    log = (ev) => {
        ev.preventDefault();
        this.props.history.push(`/register`);
    }

    render() {
        const slides = items.map((item) => {
            return (
                <CarouselItem
                    onExiting={() => this.setState({ animating: true })}
                    onExited={() => this.setState({ animating: false })}
                    key={item.src}
                    className="c-item"
                >
                    <div className="c-div">
                        <img className="c-img" src={item.src} alt={item.altText} />
                        <div className="carousel-caption">
                            <h3 className="c-caption">{item.caption}</h3>
                        </div>
                    </div>
                    {/* <CarouselCaption captionText={item.caption} /> */}
                </CarouselItem>
            );
        });
        return (
            <div>
                <div className="container-fluid w-con">
                    <div className="about-logo">
                        <h1 align="center" className="text">Welcome</h1>
                        <img src={Logo} className="img-abo" align="center" alt="logo" />
                        <br />
                        <div>
                            <h4 align="center" className="text">GigVee</h4>
                            <p className="lead text" align="center" >making a difference in people...</p>
                        </div>
                    </div>
                    <div>
                        <h1 align="center" className="text">
                            <Typewriter
                                loop
                                cursor
                                cursorStyle='_'
                                typeSpeed={70}
                                deleteSpeed={50}
                                delaySpeed={1000}
                                words={['Buy & Sell', 'Employ & Get Employed', 'Hire & Get Hired', 'Gig & Get Gigged', 'GigVee']}
                            />
                        </h1>
                    </div>
                    <br></br>
                    <div align='center'>
                        <Button className="btn btn-success" onClick={this.log}>Get Started</Button>
                    </div>

                </div>
                <br />
                <div>

                    <Carousel
                        activeIndex={this.state.activeIndex}
                        next={this.next}
                        previous={this.previous}
                    >
                        <CarouselIndicators items={items} activeIndex={this.state.activeIndex} onClickHandler={this.goToIndex} />
                        {slides}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                    </Carousel>

                </div>
                <br />
                <div className="container-fluid">

                    <h1 align="center">About GigVee</h1>
                    <div className="about-logo">
                        <img src={Logo} className="img-abo" align="center" alt="logo" />
                        <br />
                        <div>
                            <h4 align="center">GigVee</h4>
                            <p className="lead" align="center" >making a difference in people...</p>
                        </div>
                    </div>
                    <div>
                        <p>
                            <strong className="text">GigVee</strong> is an online platform that truely brings the <strong className="text">Business World</strong> to the Internet. It is the place where you can buy and sell goods and services, get employees or get employed. We help connect you to potential buyers and sellers, employees and employers who are around you.
                  <br />
                            <br />
                             Once you've registered, <strong className="text">GigVee</strong> allows you to create a store and post what you do. Other users will be able to see your posts and will be able to make enquiries as well as make orders.
                  <br />
                            <br />
                  You can post anything you do, ranging from your products and services, even to available vacancies in your business if your business is hiring
                  <br />
                            <br />
                  Wtih <strong className="text">GigVee</strong> you can easily get potential customers near you.
                  <br />
                            <br />
                  We hope you enjoy your journey into a better business experience......
                  <br />
                            <span className="quote">~John Alalade</span>
                            <br />
                            <div align='center'>
                                <Button className="btn btn-success" onClick={this.log}>Get Started</Button>
                            </div>
                            <br />
                            <h5 align="center">Contact</h5>
                            <div align="center">
                                <a href="mailto:gigveeteam@gmail.com">
                                    <FontAwesomeIcon icon={faGooglePlusG} size='lg' className="btn-danger btn-g"></FontAwesomeIcon> <strong>gigveeteam@gmail.com</strong>
                                </a>
                            </div>
                        </p>
                    </div>
                </div>
                <div className="bottom">
                    <p align="center"> GigVee Team {year.slice(10, 15)}</p>
                </div>
            </div>
        );
    }
}

export default Welcome

// &#169;