function generateOTP(length = 6) {
    const chars = '0123456789'; // characters from which OTP will be generated
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }
    return otp;
  }
  