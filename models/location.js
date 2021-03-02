/*
Copyright (C) 2021  Stefan Begerad

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const mongoose=require('mongoose')
const Schema=mongoose.Schema

/*create Schema*/
const locationSchema=new Schema({
    uuid:{type:String,required:true,unique:true},
    lat:{type:Number,min:-90,max:90},
    lon:{type:Number,min:-180,max:180},
    ts:Number,
    alias:String,
    vehicle:String
})

/*convert Schema into a Model*/
var Location=mongoose.model('Location',locationSchema)
module.exports=Location

