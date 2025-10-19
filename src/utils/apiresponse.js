class Apiresponse{
    constructor(statuscode,data,message="success"){
        this.statuscode=statuscode
        this.data=data
        this.message=message
        this.success = true;
    }
    toJSON() {
    return {
      statusCode: this.statusCode,
      data: this.data,
      message: this.message
    };
  }
}

export default Apiresponse 