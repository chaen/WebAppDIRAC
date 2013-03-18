/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext
		.define(
				'DIRAC.AccountingPlot.classes.AccountingPlot',
				{
					extend : 'Ext.dirac.core.Module',

					requires : [ 
					             'Ext.util.*', 
					             'Ext.panel.Panel',
					             "Ext.form.field.Text",
					             "Ext.button.Button",
					             "Ext.menu.Menu",
					             "Ext.form.field.ComboBox",
					             "Ext.layout.*",
					             "Ext.form.field.Date",
					             "Ext.form.field.TextArea",
					             "Ext.form.field.Checkbox",
					             "Ext.form.FieldSet",
					             "Ext.Button",
					             "Ext.dirac.utils.DiracMultiSelect",
					             "Ext.ux.form.MultiSelect"],					
					             
					loadState : function(data) {
						
					},

					getStateData : function() {
						
						
						var me = this;
						var oReturn = {};
						
						return oReturn;

					},
					            
					initComponent : function() {
						
						var me = this;
						me.launcher.title = "Accounting Plot";
						
						/*
						 * -----------------------------------------------------------------------------------------------------------
						 * DEFINITION OF THE LEFT PANEL
						 * -----------------------------------------------------------------------------------------------------------
						 */
						
						me.leftPanel = new Ext.create('Ext.panel.Panel',{
						    title: 'Selectors',
						    region:'west',
						    floatable: false,
						    margins: '0',
						    width: 280,
						    minWidth: 230,
						    maxWidth: 350,
						    bodyPadding: 5,
						    layout:'anchor',
						    autoScroll : true
						});
						
						me.descPlotType = {
								DataOperation:{
										title:"Data Operation",
										selectionConditions:[
										                     ["OperationType","Operation Type"],
										                     ["User","User"],
										                     ["ExecutionSite","Execution Site"],
										                     ["Source","Source Site"],
										                     ["Destination","Destination Site"],
										                     ["Protocol","Protocol"],
										                     ["FinalStatus","Final Transfer Status"]
										                     ]
									
								},
								Job:{
									title:"Job",
									selectionConditions:[
									                     ["JobGroup","Job Group"],
									                     ["JobType","Job Type"],
									                     ["JobClass","Job Class"],
									                     ["Site","Site"],
									                     ["ProcessingType","Processing Type"],
									                     ["FinalMajorStatus","Final Major Status"],
									                     ["FinalMinorStatus","Final Minor Status"],
									                     ["User","User"],
									                     ["UserGroup","User Group"]
									                     ]
								
								},
								WMSHistory:{
									title:"WMS History",
									selectionConditions:[
									                     ["User","User"],
									                     ["UserGroup","User Group"],
									                     ["Status","Major Status"],
									                     ["MinorStatus","Minor Status"],
									                     ["ApplicationStatus","Application Status"],
									                     ["Site","Site"],
									                     ["JobGroup","Job Group"],
									                     ["JobSplitType","Job Split Type"]
									                     ]
								
								},
								Pilot:{
									title:"Pilot",
									selectionConditions:[
									                     ["User","User"],
									                     ["UserGroup","User Group"],
									                     ["Site","Site"],
									                     ["GridCE","Grid CE"],
									                     ["GridMiddleware","Grid Middleware"],
									                     ["GridResourcesBroker","Grid Resource Broker"],
									                     ["GridStatus","Grid Status"]
									                     ]
								
								},
								SRMSpaceTokenDeployment:{
									title:"SRM Space Token Deployment",
									selectionConditions:[
									                     ["Site","Site"],
									                     ["Hostname","Hostname"],									                     
									                     ["SpaceTokenDesc","Space Token Description"],
									                     ]
								
								}
								
						};
						
						me.cmbDomain = Ext.create('Ext.form.field.ComboBox', {
						    fieldLabel: "Domain",
						    queryMode: 'local',
						    labelAlign:'top',
						    //width:260,
						    displayField: "text",
						    valueField: "value",
						    anchor:'100%',
						    store:new Ext.data.SimpleStore({
							        fields:['value','text'],
							        data:[["DataOperation","Data Operation"],
							              ["Job","Job"],
							              ["WMSHistory","WMS History"],
							              ["Pilot","Pilot"],
							              ["SRMSpaceTokenDeployment","SRM Space Token Deployment"]]
							      }),
							 listeners:{
								 change: function(field, newValue, oldValue, eOpts){
										
										//var me = this;
										
										Ext.Ajax.request({
											url: me._baseUrl+'AccountingPlot/getSelectionData',
											method:'POST',
										    params:{
										    	type: newValue
										    },
										    scope:me,
										    success:function(response){
										    	
										    	var oResult = Ext.JSON.decode(response.responseText);
										    	
										    	if(oResult["success"]=="true")
										    		me.applyDataToSelection(oResult,newValue);
										    	else
										    		alert(oResult["error"]);
										    	
										    }
										});
										
									}
							 }
						});
						
						
						me.cmbPlotGenerate = Ext.create('Ext.form.field.ComboBox', {
						    fieldLabel: "Plot To Generate",
						    queryMode: 'local',
						    labelAlign:'top',
						    displayField: "value",
						    valueField: "value",
						    anchor: '100%'
						});
						
						me.cmbGroupBy = Ext.create('Ext.form.field.ComboBox', {
						    fieldLabel: "Group By",
						    queryMode: 'local',
						    labelAlign:'top',
						    displayField: "text",
						    valueField: "value",
						    anchor: '100%'
						});
						
						
						me.fsetTimeSpan = Ext.create('Ext.form.FieldSet', {
							 title: 'Time Span',
							 collapsible: true,
							 layout: 'anchor'
						}); 
						
						
						me.cmbTimeSpan = Ext.create('Ext.form.field.ComboBox', {
						    queryMode: 'local',
						    displayField: "text",
						    valueField: "value",
						    anchor: '100%',
						    store:new Ext.data.SimpleStore({
						        fields:['value','text'],
						        data:[["last_day","Last Day"],
						              ["last_week","Last Week"],
						              ["last_month","Last Month"],
						              ["manual","Manual Selection"],
						              ["by_quarter","By Quarter"]]
						      })
						}); 
						
						me.calendarFrom = new Ext.create('Ext.form.field.Date',{
							width:100,
							format:'Y-m-d',
							fieldLabel: "Initial Date",
							labelAlign:'top'
							
						});
						
						me.calendarTo = new Ext.create('Ext.form.field.Date',{
							width:100,
							format:'Y-m-d',
							fieldLabel: "End Date",
							labelAlign:'top'
						});
						
						me.fsetTimeSpan.add([me.cmbTimeSpan,me.calendarFrom,me.calendarTo]);
						
						
						me.fsetSpecialConditions = Ext.create('Ext.form.FieldSet', {
							 title: 'Special Conditions',
							 collapsible: true,
							 layout: 'anchor'
						}); 
						
						
						me.fsetAdvanced = Ext.create('Ext.form.FieldSet', {
							 title: 'Advanced Options',
							 collapsible: true,
							 layout: 'anchor'
						}); 
						
						me.advancedPilotTitle = Ext.create('Ext.form.field.Text',{
							
							fieldLabel: "Pilot Title",
						    labelAlign:'top',
						    anchor:"100%"
						});

						me.advancedPin = Ext.create('Ext.form.field.Checkbox',{
							 boxLabel  : 'Pin Dates'
						});
							
						me.advancedNotScaleUnits = Ext.create('Ext.form.field.Checkbox',{
							 boxLabel  : 'Do not scale units'
						});
						
						me.fsetAdvanced.add([me.advancedPilotTitle,
						                     me.advancedPin,
						                     me.advancedNotScaleUnits]);
						
						me.leftPanel.add([me.cmbDomain,
						                  me.cmbPlotGenerate,
						                  me.cmbGroupBy,
						                  me.fsetTimeSpan, 
						                  me.fsetSpecialConditions,
						                  me.fsetAdvanced]);
						
						me.btnPlot = new Ext.Button({
							
							text: 'Plot',
							margin:3,
							iconCls:"jm-submit-icon",
							handler: function() {
								
							},
							scope:me
							
						});
						
						me.btnPlotNewTab = new Ext.Button({
							
							text: 'Plot in new tab',
							margin:3,
							iconCls:"jm-reset-icon",
							handler: function() {
								
							},
							scope:me
							
						});
						
						me.btnReset = new Ext.Button({
							
							text: 'Reset',
							margin:3,
							iconCls:"jm-refresh-icon",
							handler: function() {
								
							},
							scope:me
							
						});
						
						me.btnRefresh = new Ext.Button({
							
							text: 'Refresh',
							margin:3,
							iconCls:"jm-refresh-icon",
							handler: function() {
								
							},
							scope:me
							
						});
						
						var oPanelButtons = new Ext.create('Ext.panel.Panel',{
							bodyPadding: 5,
						    autoHeight:true,
						    border:false,
							items:[me.btnPlot,
							       me.btnPlotNewTab,
							       me.btnReset,
							       me.btnRefresh]
						});
						
						me.leftPanel.add(oPanelButtons);
						
						/*
						 * -----------------------------------------------------------------------------------------------------------
						 * DEFINITION OF THE MAIN CONTAINER
						 * -----------------------------------------------------------------------------------------------------------
						 */
						Ext.apply(me, {
							layout : 'border',
							bodyBorder: false,
							defaults: {
							    collapsible: true,
							    split: true
							},
							items : [ me.leftPanel ]
						});

						me.callParent(arguments);
						
					},
					applyDataToSelection:function(oData,sValue){
						
						var me = this;
						var oList = Ext.JSON.decode(oData["result"]["plotsList"]);	
						
						me.__oprDoubleElementItemList(oList);
						
						me.cmbPlotGenerate.store = new Ext.data.SimpleStore({
												        fields:['value'],
												        data: oList
												      });				
						
						var oSelectionData = Ext.JSON.decode(oData["result"]["selectionValues"]);
						var oSelectionOptions = me.descPlotType[sValue]["selectionConditions"];
						
						me.fsetSpecialConditions.removeAll();
						
						for(var i=0;i<oSelectionOptions.length;i++){
							
							if((oSelectionOptions[i][0] == "User")||(oSelectionOptions[i][0] == "UserGroup")){
								
								//to be taken from _app._cf
								
								
								
							}else{
								
								var oList = oSelectionData[oSelectionOptions[i][0]];
								me.__oprDoubleElementItemList(oList);
								
								//Makes problems !!!
								
//								var oMultiList = Ext.create('Ext.dirac.utils.DiracMultiSelect', {
//									    fieldLabel: oSelectionOptions[i][1],
//									    displayField: "text",
//									    valueField: "value",
//									    anchor:'100%',
//									    height:140,
//									    store:new Ext.data.SimpleStore({
//										        fields:['value','text'],
//										        data:oList
//										      })
//								});
//								
//								me.fsetSpecialConditions.add(oMultiList);
								
								
							}
								
							
						}
						
						
					},
					
					__oprDoubleElementItemList:function(oList){
						
						for(var i=0;i<oList.length;i++)
							oList[i]=[oList[i],oList[i]];
						
					}
				});

				
