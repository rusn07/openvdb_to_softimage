// New Plugin
// Initial code generated by Softimage SDK Wizard
// Executed Wed Feb 1 00:51:44 UTC+0200 2012 by Core
// 
// Tip: To add a command to this plug-in, right-click in the 
// script editor and choose Tools > Add Command.

function XSILoadPlugin( in_reg )
{
	in_reg.Author = "Oleg Bliznuk";
	in_reg.Name = "VDB_Menu";
	in_reg.Email = "gbotfx@gmail.com";
	in_reg.Major = 1;
	in_reg.Minor = 1;

    // Register a single Menu entry point on the Help menu
	in_reg.RegisterMenu( siMenuMainTopLevelID   , "VDB" );
	//RegistrationInsertionPoint - do not remove this line

	return true;
};

function XSIUnloadPlugin( in_reg )
{
	var strPluginName;
	strPluginName = in_reg.Name;
	Application.LogMessage(strPluginName + " has been unloaded.",siVerbose);
	return true;
};

////////////
function VDB_Init( in_context )
{

        // Get the menu object from the Context input
        var topMenu = in_context.Source;

        var CREATION_LABEL = topMenu.AddItem( "Create", siMenuItemSection  );
        CREATION_LABEL.SetBackgroundColor (190, 40, 40 );

       // topMenu.AddCallbackItem( "Create Base Volume Container", "vdb_createVolume" );
		//topMenu.AddCallbackItem( "Create Particle Mesher", "vdb_createMesher" );
		//topMenu.AddCallbackItem( "Create Basic Cloudrig", "vdb_createCloudrig" );
		//topMenu.AddCallbackItem( "Create BooleanOp", "vdb_createBooleanOp" );
		//topMenu.AddCallbackItem( "Create Basic Fracture", "vdb_createFracture" );
		
		// add mesh processing tools
		var meshTools = topMenu.AddItem( "Mesh Tools", siMenuItemSubmenu );	
		meshTools.AddCallbackItem( "Create Base Mesher", "vdb_createBaseMesher" );
		meshTools.AddCallbackItem( "Create Particle Mesher", "vdb_createParticleMesher" );
		
		// add volume processing tools
		var volTools = topMenu.AddItem( "Volume Tools", siMenuItemSubmenu );
		volTools.AddCallbackItem( "Create Base Volume Container", "vdb_createBaseVolume" );
		//volTools.AddCallbackItem( "Create Cloud Rig", "vdb_createCloudrig" );
		
		
		// utils
		 var  UTILS_LABEL = topMenu.AddItem( "Utils", siMenuItemSection  );
       UTILS_LABEL.SetBackgroundColor (190, 40, 40 );
		
		topMenu.AddCallbackItem( "Log File Info", "vdb_logFileInfo" );
		topMenu.AddCallbackItem( "Create Slice Visualization", "vdb_sliceViz" );
      
	return true;
};



// #################################################33
// volume tools
function vdb_createBaseVolume( in_ctxt )
{
	var volContObj = CreatePrim("Cube", "MeshSurface", "VDB_BaseVolumeContainer", null);
	
	if (  Application.Plugins("Arnold Shaders")!=null ) 
	{
		SITOA_AddParametersProperties(volContObj, null);
		SetValue(volContObj + ".Arnold_Parameters.step_size", 2, null);
	}	
	
	var icetree = ApplyOp("ICETree",volContObj, siNode, null, null, 0);
	SetValue(icetree+".Name", "VDB_ICETree", null);

	AddPortToICENode(icetree+".port1", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port2", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port3", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port4", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port5", siNodePortDataInsertionLocationAfter);

	var setvdb = AddICECompoundNode("Set VDB Grid", icetree);
	ConnectICENodes(icetree+".port1", setvdb+".Execute");
	
	var resizer = AddICECompoundNode("VDB Resize Container to Active Volume", icetree);
	ConnectICENodes(icetree+".port3", resizer+".Perform");
	
	var platonic = AddICECompoundNode("VDB Platonic Sphere", icetree);
	//SetValue(platonic+".Densify", true, null);
	ConnectICENodes(icetree+".Set_VDB_Grid.Value", platonic+".VDB_Grid");
	
	var disp = AddICECompoundNode("VDB Display Grid Info", icetree);	
	ConnectICENodes(icetree+".port4", disp+".Perform");
	
	var getvdb = AddICECompoundNode("Get VDB Grid", icetree);	
	ConnectICENodes(resizer+".VDBGrid", getvdb+".VDB_Grid");
	ConnectICENodes(disp+".VDBGrid",  getvdb+".VDB_Grid");
	return true;
};

function vdb_createCloudrig( in_ctxt )
{
	var volContObj = CreatePrim("Cube", "MeshSurface", "VDB_BaseVolumeContainer", null);
	
	if (  Application.Plugins("Arnold Shaders")!=null ) 
	{
		SITOA_AddParametersProperties(volContObj, null);
		SetValue(volContObj + ".Arnold_Parameters.step_size", 2, null);
	}	
	
	var icetree = ApplyOp("ICETree",volContObj, siNode, null, null, 0);
	SetValue(icetree+".Name", "VDB_ICETree", null);

	AddPortToICENode(icetree+".port1", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port2", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port3", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port4", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port5", siNodePortDataInsertionLocationAfter);

	var setvdb = AddICECompoundNode("Set VDB Grid", icetree);
	ConnectICENodes(icetree+".port1", setvdb+".Execute");
	
	var resizer = AddICECompoundNode("VDB Resize Container to Active Volume", icetree);
	ConnectICENodes(icetree+".port3", resizer+".Perform");
	
	var platonic = AddICECompoundNode("VDB Platonic Sphere", icetree);
	//SetValue(platonic+".Densify", true, null);
	ConnectICENodes(icetree+".Set_VDB_Grid.Value", platonic+".VDB_Grid");
	
	var disp = AddICECompoundNode("VDB Display Grid Info", icetree);	
	ConnectICENodes(icetree+".port4", disp+".Perform");
	
	var getvdb = AddICECompoundNode("Get VDB Grid", icetree);	
	ConnectICENodes(resizer+".VDBGrid", getvdb+".VDB_Grid");
	ConnectICENodes(disp+".VDBGrid",  getvdb+".VDB_Grid");
	return true;
};



// #################################################33
// mesh tools
function vdb_createBaseMesher( in_ctxt )
{
	var mesherObj = GetPrim("EmptyPolygonMesh", "VDB_BaseMesher", null, null);
	
	var icetree = ApplyOp("ICETree",mesherObj, siNode, null, null, 0);
	SetValue(icetree+".Name", "VDB_ICETree", null);

	AddPortToICENode(icetree+".port1", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port2", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port3", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port4", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port5", siNodePortDataInsertionLocationAfter);

	var setvdb = AddICECompoundNode("Set VDB Grid", icetree);
	ConnectICENodes(icetree+".port1", setvdb+".Execute");
	
	var polygonize = AddICECompoundNode("VDB Polygonize Grid", icetree);
	ConnectICENodes(icetree+".port4", polygonize+".Perform");
	
	var platonic = AddICECompoundNode("VDB Platonic Sphere", icetree);
	SetValue(platonic+".Densify", false, null);
	ConnectICENodes(icetree+".Set_VDB_Grid.Value", platonic+".VDB_Grid");
	
	var disp = AddICECompoundNode("VDB Display Grid Info", icetree);	
	ConnectICENodes(icetree+".port3", disp+".Perform");
	
	var getvdb = AddICECompoundNode("Get VDB Grid", icetree);	
	ConnectICENodes(polygonize+".VDBGrid", getvdb+".VDB_Grid");
	ConnectICENodes(disp+".VDBGrid",  getvdb+".VDB_Grid");
	
	return true;
}

function vdb_createParticleMesher( in_ctxt )
{
	
	var slctName = "";
	var vdbobj = application.selection(0);
	if ( vdbobj )
	   slctName = vdbobj.name;

	var mesherObj = GetPrim("EmptyPolygonMesh","VDB_PCloudMesher", null, null);

	var icetree = ApplyOp("ICETree",mesherObj, siNode, null, null, 0);
	SetValue(icetree+".Name", "VDB_ICETree", null);

	AddPortToICENode(icetree+".port1", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port2", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port3", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port4", siNodePortDataInsertionLocationAfter);
	AddPortToICENode(icetree+".port5", siNodePortDataInsertionLocationAfter);

	var setvdb = AddICECompoundNode("Set VDB Grid", icetree);
	ConnectICENodes(icetree+".port1", setvdb+".Execute");
	
	var polygonize = AddICECompoundNode("VDB Polygonize Grid", icetree);
	ConnectICENodes(icetree+".port4", polygonize+".Perform");
	
	var pcvoxeliz = AddICECompoundNode("VDB Voxelize Particles", icetree);
	SetValue(pcvoxeliz+".Reference", slctName, null);
	ConnectICENodes(icetree+".Set_VDB_Grid.Value", pcvoxeliz+".VDB_Grid");
	

	var getvdb = AddICECompoundNode("Get VDB Grid", icetree);	
	ConnectICENodes(polygonize+".VDBGrid", getvdb+".VDB_Grid");
    return true;
};





function vdb_createBooleanOp( in_ctxt )
{
	var e = GetPrim("EmptyPolygonMesh", "VDB_BooleanOpResult", null, null);
    return true;
};




function vdb_createFracture( in_ctxt )
{
	var e = GetPrim("EmptyPolygonMesh", "VDB_FractureOpResult", null, null);
    return true;
};

function vdb_createMorpher( in_ctxt )
{
	var e = GetPrim("EmptyPolygonMesh", "VDB_MorpherOpResult", null, null);
    return true;
};

// #################################################33
// utility
function vdb_logFileInfo ( in_ctxt )
{
	var initialDir ;
	if ( Application.Platform == "Win64"  )
	{
		initialDir = "D:\\" ;
	}
	else
	{
		initialDir = "/var/tmp" ;
	}
	var oUIToolkit = new ActiveXObject("XSI.UIToolKit") ;
	var oFileBrowser = oUIToolkit.FileBrowser ;
	oFileBrowser.DialogTitle = "Select a file" ;
	oFileBrowser.InitialDirectory = initialDir ;
	oFileBrowser.Filter = "OpenVDB file only(*.vdb)|*.vdb||" ;
	oFileBrowser.ShowOpen() ; 
	if ( oFileBrowser.FilePathName != "" )
		VDBGetFileInfo ( oFileBrowser.FilePathName );
		
	 return true;
}


function vdb_sliceViz ( in_ctxt )
{
	var slctName = "";
	var vdbobj = application.selection(0);
	if ( vdbobj )
	   slctName = vdbobj.name;


	var pcloud = GetPrim("PointCloud", "VDB_sliceVisualization", null, null);
	var icetree = ApplyOp("ICETree", pcloud, siNode, null, null, 0);
	SetValue(icetree+".Name", "VDB_ICETree", null);
	var viz = AddICECompoundNode("VDB Visualize Grid Slice", icetree);
	ConnectICENodes(icetree+".port1", viz+".Perform");


	var getvdb = AddICECompoundNode("Get VDB Grid", icetree);
	ConnectICENodes(viz+".In_VDB_Grid", getvdb+".VDB_Grid");
	SetValue(getvdb+".Reference", slctName, null);
}