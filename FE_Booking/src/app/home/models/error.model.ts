export class Errors { 
   public name?: string;
   public namespace?: string;
   public reason?: string;
   public message?: string;
   public source?: Source;
   public time?: string;
   public type?: string
   public createDate?:Date
   /**
    *
    */
   constructor() {
       
   }
}

export class Source {
    public component?: string;
    public  host?: string
}
