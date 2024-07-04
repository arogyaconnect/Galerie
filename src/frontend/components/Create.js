import axios from 'axios';
import { useState, useRef } from 'react';
import { ethers } from "ethers";
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaTag, FaGavel, FaUsers } from 'react-icons/fa';
import Confetti from 'react-dom-confetti';
import 'react-toastify/dist/ReactToastify.css';
import './Create.css';
import nftImage from './arebg.png'; // Replace with your image path

const Create = ({ marketplace, nft }) => {
  const [fileImg, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [desc, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minBid, setMinBid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('fixed');
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setFileName(file ? file.name : "");
  };

  const sendJSONtoIPFS = async (ImgHash, walletAddress) => {
    try {
      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          name,
          description: desc,
          image: ImgHash,
          creator: walletAddress
        },
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
        }
      });

      const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;
      console.log("Token URI", tokenURI);
      mintThenList(tokenURI, walletAddress);
    } catch (error) {
      console.log("JSON to IPFS: ", error);
      setIsLoading(false);
    }
  };

  const sendFileToIPFS = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data"
          }
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);

        // Get the user's wallet address
        const signer = nft.signer;
        const walletAddress = await signer.getAddress();

        sendJSONtoIPFS(ImgHash, walletAddress);
      } catch (error) {
        console.log("File to IPFS: ", error);
        setIsLoading(false);
      }
    }
  };

  const mintThenList = async (uri, walletAddress) => {
    try {
      // mint nft
      await (await nft.mint(uri)).wait();
      // get tokenId of new nft
      const id = await nft.tokenCount();
      // approve marketplace to spend nft
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      // add nft to marketplace
      const listingPrice = ethers.utils.parseEther(price.toString());
      await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
      // Show success notification
      toast.success("NFT Listed Successfully!", {
        position: "top-center"
      });
      setIsSuccess(true);
      setShowConfetti(true); // Show confetti
      setTimeout(() => {
        resetForm();
        setShowConfetti(false); // Hide confetti after some time
      }, 5000); // Display success for 5 seconds before resetting the form and hiding confetti
    } catch (error) {
      console.log("Minting/Listing: ", error);
      toast.error("Failed to list NFT.", {
        position: "top-center"
      });
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setName("");
    setDescription("");
    setPrice("");
    setMinBid("");
    setStartDate("");
    setEndDate("");
    setIsLoading(false);
    setIsSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 79,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };

  return (
    <div className="container-fluid mt-5">
      <ToastContainer />
      <div className="row">
        <div className="col-lg-3">
          <div className="image-container">
            <img src={nftImage} alt="NFT Image" />
          </div>
        </div>
        <div className="col-lg-9">
          <main role="main" className="mx-auto" style={{ maxWidth: '1000px' }}>
            <div className="content mx-auto">
              <Row className="g-4">
                <div className="upload-container">
                  <label htmlFor="file-upload" className="custom-file-upload">
                    Upload file
                  </label>
                  <span>{fileName || "PNG, JPG, GIF, WEBP or MP4. Max 200mb."}</span>
                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    type="file"
                  />
                </div>

                {/* Select Method Section */}
                <div className="method-selection">
                  <label>Select method</label>
                  <div className="method-options">
                    <div
                      className={`method-option ${selectedMethod === 'fixed' ? 'selected' : ''}`}
                      onClick={() => setSelectedMethod('fixed')}
                    >
                      <FaTag />
                      <span>Fixed Price</span>
                    </div>
                    <div
                      className={`method-option ${selectedMethod === 'auction' ? 'selected' : ''}`}
                      onClick={() => setSelectedMethod('auction')}
                    >
                      <FaGavel />
                      <span>Time Auctions</span>
                    </div>
                    <div
                      className={`method-option ${selectedMethod === 'bids' ? 'selected' : ''}`}
                      onClick={() => setSelectedMethod('bids')}
                    >
                      <FaUsers />
                      <span>Open For Bids</span>
                    </div>
                  </div>
                </div>

                {selectedMethod === 'fixed' && (
                  <Form.Control
                    onChange={(e) => setPrice(e.target.value)}
                    size="lg"
                    required
                    type="number"
                    placeholder="Price in ETH"
                    value={price}
                  />
                )}

                {selectedMethod === 'auction' && (
                  <>
                    <Form.Control
                      onChange={(e) => setMinBid(e.target.value)}
                      size="lg"
                      required
                      type="number"
                      placeholder="Minimum Bid in ETH"
                      value={minBid}
                    />
                    <Row>
                      <div className='flexfordates1'>
                        <div className='StartingDate1'>
                          <Col>
                            <Form.Group controlId="startDate">
                              <Form.Label>Starting Date</Form.Label>
                              <Form.Control
                                onChange={(e) => setStartDate(e.target.value)}
                                size="lg"
                                required
                                type="datetime-local"
                                value={startDate}
                              />
                            </Form.Group>
                          </Col>
                        </div>
                        <div className='EndingDate1'>
                          <Col>
                            <Form.Group controlId="endDate">
                              <Form.Label>Ending Date</Form.Label>
                              <Form.Control
                                onChange={(e) => setEndDate(e.target.value)}
                                size="lg"
                                required
                                type="datetime-local"
                                value={endDate}
                              />
                            </Form.Group>
                          </Col>
                        </div>
                      </div>
                    </Row>
                  </>
                )}

                {selectedMethod === 'bids' && (
                  <>
                    <Form.Control
                      onChange={(e) => setPrice(e.target.value)}
                      size="lg"
                      required
                      type="number"
                      placeholder="Price in ETH"
                      value={price}
                    />
                    <Form.Control
                      onChange={(e) => setMinBid(e.target.value)}
                      size="lg"
                      required
                      type="number"
                      placeholder="Minimum Bid in ETH"
                      value={minBid}
                    />
                    <Row>
                      <div className='flexfordates'>
                        <div className='StartingDate'>
                          <Col>
                            <Form.Group controlId="startDate">
                              <Form.Label>Starting Date</Form.Label>
                              <Form.Control
                                onChange={(e) => setStartDate(e.target.value)}
                                size="lg"
                                required
                                type="datetime-local"
                                value={startDate}
                              />
                            </Form.Group>
                          </Col>
                        </div>
                        <div className='EndingDate'>
                          <Col>
                            <Form.Group controlId="endDate">
                              <Form.Label>Ending Date</Form.Label>
                              <Form.Control
                                onChange={(e) => setEndDate(e.target.value)}
                                size="lg"
                                required
                                type="datetime-local"
                                value={endDate}
                              />
                            </Form.Group>
                          </Col>
                        </div>
                      </div>
                    </Row>
                  </>
                )}

                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  size="lg"
                  required
                  type="text"
                  placeholder="Name"
                  value={name}
                />
                <Form.Control
                  onChange={(e) => setDescription(e.target.value)}
                  size="lg"
                  required
                  as="textarea"
                  placeholder="Description"
                  value={desc}
                />
                <div className="d-grid px-0">
                  <Button className="gradient-button" onClick={sendFileToIPFS} size="lg" disabled={isLoading || isSuccess}>
                    {isLoading ? (
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : isSuccess ? (
                      <span>&#10003; NFT Listed Successfully!</span>
                    ) : (
                      'Create & List NFT!'
                    )}
                  </Button>
                </div>
              </Row>
            </div>
          </main>
        </div>
      </div>
      <div className={`fullscreen-confetti ${showConfetti ? 'show' : 'hide'}`}>
        <Confetti active={showConfetti} config={confettiConfig} />
      </div>
    </div>
  );
};

export default Create;
