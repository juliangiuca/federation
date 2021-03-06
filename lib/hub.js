var assert = require('assert');
var events = require('events');

function Hub(forge){
  this.forge = forge;
}

Hub.prototype.createGateway = function(){
  var gateway  = this.forge.Gateway.NewWithEmitter(this.transport_emitter);
  this.gateway = gateway;
  return gateway;
}

Hub.prototype.createVertex = function(){
  var vertex  = this.forge.Vertex.NewWithEmitter(this.node_emitter);
  this.vertex = vertex;
  return vertex;
}

function HubForge(app){
  assert( this.Vertex   = app.Vertex,   'Missing Dependency Vertex' );
  assert( this.Gateway  = app.Gateway,  'Missing Dependency Gateway' );
}

HubForge.prototype.New = function(){
  var hub = new Hub(this);
  return hub;
}

HubForge.prototype.NewWithEmitters = function(transports,nodes){
  var hub = this.New();
  
  hub.transport_emitter  = transports;
  hub.node_emitter       = nodes;
  
  transports.on('message',function(packet){
    hub.vertex.enqueue(packet);
  });
  
  nodes.on('message',function(packet){
    hub.gateway.enqueue(packet);
  });
  
  return hub;
}

module.exports.forge = function(app){
  return new HubForge(app);
}
