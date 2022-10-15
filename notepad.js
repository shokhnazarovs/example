import { datachannel } from './variables.js';

// Initialize notepad (text editor)
document.execCommand('defaultParagraphSeparator', false, 'div');
document.execCommand('styleWithCSS');
//----------------------------------

//notepad 
var notepadEl = document.querySelectorAll('.notepad');

// color codes must be lowercase
var colorCodes = {
    textColor: {
        default: "inherit",
        blue: "#6997f0",
        red: "#ed5151",
        green: "#85ce62",
        getKey(value) {
            for (var prop in this) {
                if(this[prop] === value)
                    return prop;
            }
            return false;
        }
    },
    bgColor: {
        default: "initial",
        blue: "#b9defd",
        red: "#ffaec8",
        green: "#c3efaf",

        getKey(value) {
            for (var prop in this) {
                if(this[prop] === value)
                    return prop;
            }
            return false;
        }
    }
}

var classNames = {
    fontSize: "notepad__icon_title",
    bold: "notepad__icon_bold",
    italic: "notepad__icon_italic",
    underline: "notepad__icon_underline",
    justifyLeft: "notepad__icon_align-left",
    justifyCenter: "notepad__icon_align-center",
    justifyRight: "notepad__icon_align-right",
    foreColor: "notepad__icon_text-color",
    HiliteColor: "notepad__icon_highliter"
}

function rgbToHex(colorName) {
    var r = Number(colorName.replace('rgb(', '').replace(')', '').split(',')[0]);
    var g = Number(colorName.replace('rgb(', '').replace(')', '').split(',')[1]);
    var b = Number(colorName.replace('rgb(', '').replace(')', '').split(',')[2]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function updateToolbar(event){
    var notepad = event.currentTarget.closest('.notepad');
    var textToolsEl = notepad.querySelector('.notepad__text-tools');
    var icons = textToolsEl.querySelectorAll('.notepad__icon');
    var colorsBox = textToolsEl.querySelector('.notepad__colors');

    // if(event.keyCode === 13 && event.type === "keyup"){
    //     var currentSelection = window.getSelection().anchorNode.parentElement;
    //     if(notepad.contains(currentSelection) && !currentSelection.classList.contains('notepad__content')){
    //         currentSelection.innerHTML = '';
    //     }
    // }

    icons.forEach(function(icon){
        var commandName = icon.getAttribute('notepad-command-id');

        if(commandName === 'fontSize'){
            var value = document.queryCommandValue('fontSize');
            if(value === "5"){
                icon.classList.add("notepad__icon_title_active");
                icon.setAttribute('value', '3');
            } else {
                icon.classList.remove("notepad__icon_title_active");
                icon.setAttribute('value', '5');
            }
        } else if(commandName === 'foreColor'){
            var value = document.queryCommandValue('foreColor');
            var selectedColor = colorCodes.textColor.getKey(rgbToHex(value));
            if(selectedColor){
                if(icon.classList.contains('notepad__icon_text-color_active')){
                    colorsBox.querySelectorAll('.notepad__color').forEach(function(color){
                        if(color.getAttribute('name') != selectedColor){
                            color.classList.remove('notepad__color_selected');
                        } else {
                            color.classList.add('notepad__color_selected');
                        }
                    });
                }
                icon.setAttribute('selected-color', selectedColor);
                selectedColor = colorCodes.textColor[selectedColor];
                icon.style.boxShadow = '0 0 0 2px ' + selectedColor + ' inset';
            } else {
                if(icon.classList.contains('notepad__icon_text-color_active')){
                    colorsBox.querySelectorAll('.notepad__color').forEach(function(color){
                        if(color.getAttribute('name') != 'default'){
                            color.classList.remove('notepad__color_selected');
                        } else {
                            color.classList.add('notepad__color_selected');
                        }
                    });
                }
                icon.setAttribute('selected-color', 'default');
                icon.style.boxShadow = 'none';
            }
        } else if(commandName === 'HiliteColor'){
            var value = window.getSelection().anchorNode.parentElement.style.backgroundColor;
            var selectedColor = colorCodes.bgColor.getKey(rgbToHex(value));
            if(selectedColor){
                if(icon.classList.contains('notepad__icon_highliter_active')){
                    colorsBox.querySelectorAll('.notepad__color').forEach(function(color){
                        if(color.getAttribute('name') != selectedColor){
                            color.classList.remove('notepad__color_selected');
                        } else {
                            color.classList.add('notepad__color_selected');
                        }
                    });
                }
                icon.setAttribute('selected-color', selectedColor);
                selectedColor = colorCodes.textColor[selectedColor];
                icon.style.boxShadow = '0 0 0 2px ' + selectedColor + ' inset';
            } else {
                if(icon.classList.contains('notepad__icon_highliter_active')){
                    colorsBox.querySelectorAll('.notepad__color').forEach(function(color){
                        if(color.getAttribute('name') != 'default'){
                            color.classList.remove('notepad__color_selected');
                        } else {
                            color.classList.add('notepad__color_selected');
                        }
                    });
                }
                icon.setAttribute('selected-color', 'default');
                icon.style.boxShadow = 'none';
            }
        } else {
            var active = document.queryCommandState(commandName);

            if(active)
                icon.classList.add(classNames[commandName] + '_active');
            else 
                icon.classList.remove(classNames[commandName] + '_active');
        }
    });
}

function startNotepad(notepadEl){
    notepadEl.forEach(function(notepad){
        var toolsEl = notepad.querySelector('.notepad__tools');
        var textToolsEl = notepad.querySelector('.notepad__text-tools');
        var contentEl = notepad.querySelector('.notepad__content');
        var themesEl = notepad.querySelector('.notepad__themes');
        var textColorIcon = notepad.querySelector('.notepad__icon_text-color');
        var highliterIcon = notepad.querySelector('.notepad__icon_highliter');
        var notepadColors = notepad.querySelector('.notepad__colors');

        // logic of text color changer icon on click
        textColorIcon.addEventListener('click', function(event){
            textColorIcon.classList.add('notepad__icon_text-color_active');
            highliterIcon.classList.remove('notepad__icon_highliter_active');
    
            notepadColors.classList.remove('notepad__colors_visible-highlite');
            notepadColors.classList.add('notepad__colors_visible-text');
            notepadColors.setAttribute('notepad-command-id', 'foreColor');
        });
        
        // logic of text highlite color changer icon on click
        highliterIcon.addEventListener('click', function(event){
            textColorIcon.classList.remove('notepad__icon_text-color_active');
            highliterIcon.classList.add('notepad__icon_highliter_active');
    
            notepadColors.classList.remove('notepad__colors_visible-text');
            notepadColors.classList.add('notepad__colors_visible-highlite');
            notepadColors.setAttribute('notepad-command-id', 'HiliteColor');
        });

        // logic of theme changer icon on click
        themesEl.querySelectorAll('.notepad__theme').forEach(function(theme){
            theme.addEventListener('click', function(event){
                if(datachannel.exercise != null && event.isTrusted){
                    try {
                        datachannel.exercise.send(JSON.stringify({
                            name: "notepad", 
                            message: {
                                notepadType: "notepad",
                                notepadID: event.currentTarget.closest('.notepad').getAttribute('notepadid'),
                                exerciseID: event.currentTarget.closest('.exercise').getAttribute('id'),
                                eventHappened: 'theme-change',
                                clickedItem: event.currentTarget.getAttribute('name')
                            }
                        }));
                    } catch {
                        var skip = true;
                    }
                }
                event.currentTarget.parentElement.querySelectorAll('.notepad__theme').forEach(function(item){
                    item.classList.toggle('notepad__theme_hidden');
                    if(event.currentTarget.getAttribute('name') === 'line-theme')
                        contentEl.classList.remove('notepad__content_line-theme');
                    else
                        contentEl.classList.add('notepad__content_line-theme');
                });
            });
        });

        //add event listeners on click to the icons and execute commands
        textToolsEl.querySelectorAll('.notepad__icon').forEach(function(icon){
            icon.addEventListener('click', function (event){
                var commandName = event.currentTarget.getAttribute('notepad-command-id');
                var commandValue = event.currentTarget.getAttribute('value');

                if(commandName === 'fontSize'){
                    if(commandValue === '5'){
                        document.execCommand('fontSize', false, '5');
                        contentEl.focus();
                    } else {
                        document.execCommand('removeFormat', false);
                        contentEl.focus();
                    }
                } else if(!(commandName === 'foreColor' || commandName === 'HiliteColor')){
                    console.log(commandName, commandValue);
                    document.execCommand(commandName, false, commandValue);
                    contentEl.focus();
                }
            });
        });

        //add event listeners on click to the icons and execute commands to change the colors of text and highlite
        textToolsEl.querySelectorAll('.notepad__color').forEach(function(icon){
            icon.addEventListener('click', function (event){
                var commandName = event.currentTarget.parentElement.getAttribute('notepad-command-id');
                var commandValue = event.currentTarget.getAttribute('name');

                if(commandName === 'foreColor'){
                    textToolsEl.querySelector('.notepad__icon_text-color').classList.remove('notepad__icon_text-color_active');
                    event.currentTarget.parentElement.classList.remove('notepad__colors_visible-text');
                    document.execCommand('foreColor', false, colorCodes.textColor[commandValue]);
                    contentEl.focus();
                } else if(commandName === 'HiliteColor'){
                    event.currentTarget.parentElement.classList.remove('notepad__colors_visible-highlite');
                    textToolsEl.querySelector('.notepad__icon_highliter').classList.remove('notepad__icon_highliter_active');
                    document.execCommand('HiliteColor', false, colorCodes.bgColor[commandValue]);
                    contentEl.focus();
                }
            });
        });

        contentEl.addEventListener('keydown', updateToolbar);
        contentEl.addEventListener('keyup', updateToolbar);
        contentEl.addEventListener('click', updateToolbar);
        textToolsEl.addEventListener('click', updateToolbar);

        // Send changes to peer through datachannel
        contentEl.addEventListener('input', function(event){
            //event.preventDefault();
            if(datachannel.exercise != null && event.isTrusted){
                try {
                    datachannel.exercise.send(JSON.stringify({
                        name: "notepad", 
                        message: {
                            notepadType: "exercise-notepad",
                            notepadID: event.currentTarget.closest('.notepad').getAttribute('notepadid'),
                            exerciseID: event.currentTarget.closest('.exercise').getAttribute('id'),
                            eventHappened: 'input',
                            inputData: event.currentTarget.innerHTML
                        }
                    }));
                } catch {
                    var skip = true;
                }
            }
        });

        // indicate notepad focus by peer
        contentEl.addEventListener('focus', function(event){
            if(datachannel.exercise != null && event.isTrusted){
                try {
                    datachannel.exercise.send(JSON.stringify({
                        name: "notepad", 
                        message: {
                            notepadType: "notepad",
                            notepadID: event.currentTarget.closest('.notepad').getAttribute('notepadid'),
                            exerciseID: event.currentTarget.closest('.exercise').getAttribute('id'),
                            eventHappened: 'focus',
                        }
                    }));
                } catch {
                    var skip = true;
                }
            } else {
                if(!event.isTrusted)
                    event.currentTarget.closest('.notepad').classList.add('notepad_controlled');
            }
        });

        //indicate notepad blur by peer
        contentEl.addEventListener('blur', function(event){
            if(datachannel.exercise != null && event.isTrusted){
                try {
                    datachannel.exercise.send(JSON.stringify({
                        name: "notepad", 
                        message: {
                            notepadType: "notepad",
                            notepadID: event.currentTarget.closest('.notepad').getAttribute('notepadid'),
                            exerciseID: event.currentTarget.closest('.exercise').getAttribute('id'),
                            eventHappened: 'blur',
                        }
                    }));
                } catch {
                    var skip = true;
                }
            } else {
                event.currentTarget.closest('.notepad').classList.remove('notepad_controlled');
            }
        });
    });
}

startNotepad(notepadEl);
