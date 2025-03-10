import $ from 'jquery';
import KEditor from 'keditor';
const flog = KEditor.log;

KEditor.components['video'] = {
    init: function (contentArea, container, component, keditor) {
        flog('init "video" component', component);
        
        let componentContent = component.children('.keditor-component-content');
        let video = componentContent.find('video');
        
        if (!video.parent().is('.video-wrapper')) {
            video.wrap('<div class="video-wrapper"></div>');
        }
    },
    
    getContent: function (component, keditor) {
        flog('getContent "video" component', component);
        
        let componentContent = component.children('.keditor-component-content');
        let video = componentContent.find('video');
        video.unwrap();
        
        return componentContent.html();
    },
    
    settingEnabled: true,
    
    settingTitle: 'Video Settings',
    
    initSettingForm: function (form, keditor) {
        flog('init "video" settings', form);
        
        form.append(
            '<form class="form-horizontal">' +
            '    <div class="form-group">' +
            '        <label for="videoFileInput" class="col-sm-12">Video file</label>' +
            '        <div class="col-sm-12">' +
            '            <div class="video-toolbar">' +
            '                <a href="#" class="btn-videoFileInput btn btn-sm btn-primary"><i class="fa fa-upload"></i></a>' +
            '                <input id="videoFileInput" type="file" style="display: none">' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '        <label for="video-autoplay" class="col-sm-12">Autoplay</label>' +
            '        <div class="col-sm-12">' +
            '            <input type="checkbox" id="video-autoplay" />' +
            '        </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '        <label for="video-loop" class="col-sm-12">Loop</label>' +
            '        <div class="col-sm-12">' +
            '            <input type="checkbox" id="video-loop" />' +
            '        </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '        <label for="video-showcontrols" class="col-sm-12">Show Controls</label>' +
            '        <div class="col-sm-12">' +
            '            <input type="checkbox" id="video-showcontrols" checked />' +
            '        </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '        <label for="" class="col-sm-12">Ratio</label>' +
            '        <div class="col-sm-12">' +
            '            <input type="radio" name="video-radio" class="video-ratio" value="4/3" checked /> 4:3' +
            '        </div>' +
            '        <div class="col-sm-12">' +
            '            <input type="radio" name="video-radio" class="video-ratio" value="16/9" /> 16:9' +
            '        </div>' +
            '    </div>' +
            '    <div class="form-group">' +
            '        <label for="video-width" class="col-sm-12">Width (px)</label>' +
            '        <div class="col-sm-12">' +
            '            <input type="number" id="video-width" min="320" max="1920" class="form-control" value="320" />' +
            '        </div>' +
            '    </div>' +
            '</form>'
        );
    },
    
    showSettingForm: function (form, component, keditor) {
        flog('showSettingForm "video" settings', form, component);
        
        let options = keditor.options;
        let video = component.find('video');
        let fileInput = form.find('#videoFileInput');
        let btnVideoFileInput = form.find('.btn-videoFileInput');
        btnVideoFileInput.on('click', function (e) {
            e.preventDefault();
            
            fileInput.trigger('click');
        });
        fileInput.off('change').on('change', function () {
            let file = this.files[0];
            if (/video/.test(file.type)) {
                // Todo: Upload to your server :)
                
                video.attr('src', URL.createObjectURL(file));
                
                video.load(function () {
                    keditor.showSettingPanel(component, options);
                });
            } else {
                alert('Your selected file is not an video file!');
            }
        });
        
        let autoplayToggle = form.find('#video-autoplay');
        autoplayToggle.off('click').on('click', function (e) {
            if (this.checked) {
                video.prop('autoplay', true);
            } else {
                video.removeProp('autoplay');
            }
        });
        
        let loopToggle = form.find('#video-loop');
        loopToggle.off('click').on('click', function (e) {
            if (this.checked) {
                video.prop('loop', true);
            } else {
                video.removeProp('loop');
            }
        });
        
        let ratio = form.find('.video-ratio');
        ratio.off('click').on('click', function (e) {
            if (this.checked) {
                let currentWidth = video.css('width') || video.prop('width');
                currentWidth = currentWidth.replace('px', '');
                
                let currentRatio = this.value === '16/9' ? 16 / 9 : 4 / 3;
                let height = currentWidth / currentRatio;
                video.css('width', currentWidth + 'px');
                video.css('height', height + 'px');
                video.removeProp('width');
                video.removeProp('height');
            }
        });
        
        let showcontrolsToggle = form.find('#video-showcontrols');
        showcontrolsToggle.off('click').on('click', function (e) {
            if (this.checked) {
                video.attr('controls', 'controls');
            } else {
                video.removeAttr('controls');
            }
        });
        
        let videoWidth = form.find('#video-width');
        videoWidth.off('change').on('change', function () {
            video.css('width', this.value + 'px');
            let currentRatio = form.find('.video-ratio:checked').val() === '16/9' ? 16 / 9 : 4 / 3;
            let height = this.value / currentRatio;
            video.css('height', height + 'px');
            video.removeProp('width');
            video.removeProp('height');
        });
    }
};
