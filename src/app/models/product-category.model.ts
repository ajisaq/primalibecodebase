import { isString, isObjectLike } from 'lodash';

export class ProductCategory
{
    iri?: string;
    iriType?: string;
    id?: number;
    name?: string;
    //description?: string;

    /**
     * Constructor
     *
     * @param productCategory
     */
    constructor(productCategory?:any)
    {
        productCategory = productCategory || {};
        //if string, pass to iri only 
        if (isString(productCategory)){
            this.iri = productCategory;
        }
        if (isObjectLike(productCategory)){
            this.iri = productCategory['@id'] || null;
            this.iriType = productCategory['@type'] || null;
            this.id = productCategory.id || null;//FuseUtils.generateGUID();
            this.name = productCategory.name || null;
            //this.description = productCategory.description || '';
        }
    }

}
