
import { ProductModel } from '../../data';
import { CreateProductDto, CustomError, PaginationDto } from '../../domain';


export class ProductService {

    //DI
    constructor() {};

    async createProduct( createProductDto: CreateProductDto ) {

        const productExists = await ProductModel.findOne( {name: createProductDto.name} );
        if ( productExists ) throw CustomError.badRequest("Product already exists.");

        try {

            const product = new ProductModel( createProductDto );

            await product.save();

            return product;
            
        } catch (error) {
             
            CustomError.internalServer(`${ error }`);
        };
    };

    async getProducts( paginationDto: PaginationDto ) {

        const { page, limit } = paginationDto;

        try {

            const [ total, products ] = await Promise.all([
                ProductModel.find().countDocuments(),
                ProductModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
                    // .populate("user", "name email")
                    .populate("user")
                    .populate("category")
            ]);

            return {

                page: page,
                limit: limit,
                total: total,
                next: ( page + 1 >= (total/limit) )? null : `/api/products?page=${ page + 1 }&limit=${ limit }`,
                prev: ( page - 1 > 0)? `/api/products?page=${ page - 1 }&limit=${ limit }`: null,
                categories: products,
            };
            
        } catch (error) {
            
            throw CustomError.internalServer("Internal Server Error");
        };
    };
};


