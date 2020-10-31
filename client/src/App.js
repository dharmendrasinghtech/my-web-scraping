import React, { Component } from "react";
import "./App.css";
import axios from 'axios';
import {
    Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrapingData: [],
            url: '',
            isLoading: false,
            siteName: '',
        };
    }

    componentDidMount() {
    }
    getScrapingData(values) {
        var sourceString = values.url.replace('http://', '').replace('https://', '').replace('www.', '').replace('.com', '').split(/[/?#]/)[0];
        this.setState({ isLoading: true, siteName: sourceString })
        axios.get(`http://localhost:9000/scrapingApi/getScaringData/`, { params: values })
            .then(res => {
                setTimeout(() => {
                    this.setState({ scrapingData: res.data, isLoading: false })
                }, 15000)
            }).catch(err => err);
    }

    render() {
        const { scrapingData, url, isLoading, siteName } = this.state;
        console.log(this.state.scrapingData)
        return (
            <div class="report-body">
                <div className="app">
                    <Formik
                        initialValues={url}
                        enableReinitialize
                        validateOnBlur={true}
                        onSubmit={(values, actions) => this.getScrapingData(values, actions)}
                        validationSchema={Yup.object().shape({
                            url: Yup.string()
                                .matches(
                                    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                                    'Enter correct url!'
                                )
                                .required('Please enter website')
                        })}>
                        {({
                            errors, touched,
                        }) => (
                                <Form>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><Field
                                                    name="url"
                                                    autoFocus={true}
                                                    autoComplete="off"
                                                    className={
                                                        errors.url && touched.url ? 'error a-text-input' : 'a-text-input'
                                                    }
                                                />
                                                    <div className="error">
                                                        {' '}
                                                        <ErrorMessage name="url" />
                                                    </div>
                                                </td>
                                                <td><button>Scrap</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Form>
                            )}
                    </Formik>
                </div>
                <div className='division'></div>
                {!isLoading && scrapingData.length > 0 && <p>Scraping Result:</p>}
                {isLoading &&
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
                }
                {!isLoading && scrapingData.length > 0 &&
                    scrapingData.map((item, index) => (
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Tilte:</td><td>{item.title}</td>
                                    </tr>
                                    <tr>
                                        <td>Meta Description:</td><td>{item.desc}</td>
                                    </tr>
                                    <tr>
                                        <td>Meta Keyword:</td><td>{item.keyword}</td>
                                    </tr>
                                    <tr>
                                        <td>Screenshot:</td><td> <img key={index} className="App-intro" src={`http://localhost:9000/${siteName}.png`} height='400' width='800' alt /></td>
                                    </tr>
                                    <tr>
                                        <td>Hyperlinks:</td><td></td>
                                    </tr>
                                    {item.hyperLinks.map(link => (
                                        <tr>
                                            <td></td><td>{link}</td>
                                        </tr>
                                    ))

                                    }
                                    <tr>
                                        <td>Social Media Links:</td><td></td>
                                    </tr>
                                    {item.socialMediaLinks.map(link => (
                                        <tr>
                                            <td></td><td>{link}</td>
                                        </tr>
                                    ))

                                    }
                                </tbody>
                            </table>
                        </div>
                    ))
                }

            </div>
        );
    }
}

export default App;
