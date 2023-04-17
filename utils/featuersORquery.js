class ApiFeatures{
    constructor(query, querystr){
        this.query=query;
        this.querystr=querystr;
    }
    search(){
        const keyword= this.querystr.keyword?{
            name:{
                $regex:this.querystr.keyword,
                $options:'i',
            },
        }:{};
        // this.query.find(keyword); 
        // -- this also runs corect but the actual keyword my get modifed beacause it is using call bu reference 
        this.query.find({...keyword});  
        // this is makeing copy not reference hence the  actual key word does not modify
        return this;

    }


    filter(){
        let querystrCopy ={...this.querystr};

        const removeFilds=['keyword',"page","limit"];
        removeFilds.forEach((key)=> delete querystrCopy[key])

        // filter for price and rating
        querystrCopy=JSON.stringify(querystrCopy);
        //   converting gt to $gt and so on 
       querystrCopy= querystrCopy.replace(/\b(gt|lt|gte|lte)\b/g,key =>`$${key}`);
        this.query = this.query.find(JSON.parse(querystrCopy));
        
        return this;
    }

    pagnination(ResultPerPage ){
        const currentPage=Number(this.querystr.page)||1;
        const toSkip=ResultPerPage*(currentPage-1);
        this.query=this.query.limit(ResultPerPage).skip(toSkip);
        return this;
    }

}

module.exports=ApiFeatures;