import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class ProfileService {
  
    private apiUrl =
      environment.apiUrl + '/profile';
  
    constructor(
      private http: HttpClient
    ) {}
  
    getProfile() {
  
      return this.http.get(
        this.apiUrl
      );
  
    }
  
    saveProfile(data: any) {
  
      return this.http.put(
        this.apiUrl,
        data
      );
  
    }
  
  }