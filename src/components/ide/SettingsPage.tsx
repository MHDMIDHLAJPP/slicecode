import { X, RotateCcw, Undo2, Monitor, Type, Palette, Code, Terminal, Layout, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore, themes, fontStyles } from '@/store/settingsStore';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsPageProps {
  onClose: () => void;
}

function SettingSection({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

function SettingRow({ 
  label, 
  description, 
  children 
}: { 
  label: string; 
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SliderWithButtons({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2 w-48">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="p-1 rounded hover:bg-secondary transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="flex-1"
      />
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="p-1 rounded hover:bg-secondary transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
      <span className="text-xs text-muted-foreground w-12 text-right">
        {value}{suffix}
      </span>
    </div>
  );
}

function ThemeCard({ 
  theme, 
  isActive, 
  onClick 
}: { 
  theme: typeof themes[0]; 
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col p-3 rounded-lg border-2 transition-all text-left',
        isActive 
          ? 'border-primary bg-primary/10' 
          : 'border-border hover:border-primary/50'
      )}
    >
      <div 
        className="w-full h-16 rounded mb-2 flex overflow-hidden"
        style={{ backgroundColor: `hsl(${theme.colors.ideBg})` }}
      >
        <div 
          className="w-3 h-full"
          style={{ backgroundColor: `hsl(${theme.colors.ideActivityBar})` }}
        />
        <div 
          className="w-8 h-full"
          style={{ backgroundColor: `hsl(${theme.colors.ideSidebar})` }}
        />
        <div className="flex-1 p-1">
          <div className="flex gap-0.5 mb-1">
            <div 
              className="w-4 h-1.5 rounded-sm"
              style={{ backgroundColor: `hsl(${theme.colors.ideTabActive})` }}
            />
            <div 
              className="w-3 h-1.5 rounded-sm opacity-50"
              style={{ backgroundColor: `hsl(${theme.colors.border})` }}
            />
          </div>
          <div className="space-y-0.5">
            <div 
              className="w-full h-1 rounded-sm"
              style={{ backgroundColor: `hsl(${theme.colors.syntaxKeyword})` }}
            />
            <div 
              className="w-3/4 h-1 rounded-sm"
              style={{ backgroundColor: `hsl(${theme.colors.syntaxString})` }}
            />
            <div 
              className="w-1/2 h-1 rounded-sm"
              style={{ backgroundColor: `hsl(${theme.colors.syntaxFunction})` }}
            />
          </div>
        </div>
      </div>
      <span className="text-xs font-medium truncate w-full">{theme.name}</span>
    </button>
  );
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const settings = useSettingsStore();

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <h2 className="text-lg font-semibold">Settings</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={settings.undoLastChange}
            disabled={!settings.previousSettings}
            className="gap-1.5"
          >
            <Undo2 className="w-4 h-4" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={settings.resetToDefaults}
            className="gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 max-w-3xl mx-auto">
          {/* Display Settings */}
          <SettingSection icon={Monitor} title="Display">
            <SettingRow 
              label="Display Scale" 
              description="Adjust the overall size of the interface"
            >
              <SliderWithButtons
                value={settings.displayScale}
                onChange={settings.setDisplayScale}
                min={50}
                max={150}
                step={5}
                suffix="%"
              />
            </SettingRow>
            <SettingRow 
              label="Global Font Size" 
              description="Base font size for the interface"
            >
              <SliderWithButtons
                value={settings.globalFontSize}
                onChange={settings.setGlobalFontSize}
                min={10}
                max={24}
                suffix="px"
              />
            </SettingRow>
            <SettingRow label="UI Font Style">
              <Select 
                value={settings.globalFontStyle} 
                onValueChange={settings.setGlobalFontStyle}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontStyles.map((font) => (
                    <SelectItem key={font.id} value={font.id}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow 
              label="Compact Mode" 
              description="Reduce padding and margins for smaller screens"
            >
              <Switch 
                checked={settings.compactMode}
                onCheckedChange={settings.setCompactMode}
              />
            </SettingRow>
            <SettingRow 
              label="Animations" 
              description="Enable smooth transitions and animations"
            >
              <Switch 
                checked={settings.animationsEnabled}
                onCheckedChange={settings.setAnimationsEnabled}
              />
            </SettingRow>
          </SettingSection>

          {/* Editor Settings */}
          <SettingSection icon={Code} title="Editor">
            <SettingRow label="Font Size">
              <SliderWithButtons
                value={settings.editorFontSize}
                onChange={settings.setEditorFontSize}
                min={10}
                max={28}
                suffix="px"
              />
            </SettingRow>
            <SettingRow label="Font Style">
              <Select 
                value={settings.editorFontStyle} 
                onValueChange={settings.setEditorFontStyle}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontStyles.map((font) => (
                    <SelectItem key={font.id} value={font.id}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow label="Line Height">
              <SliderWithButtons
                value={settings.editorLineHeight}
                onChange={settings.setEditorLineHeight}
                min={1}
                max={2.5}
                step={0.1}
              />
            </SettingRow>
            <SettingRow label="Tab Size">
              <SliderWithButtons
                value={settings.editorTabSize}
                onChange={settings.setEditorTabSize}
                min={2}
                max={8}
              />
            </SettingRow>
            <SettingRow label="Word Wrap">
              <Switch 
                checked={settings.editorWordWrap}
                onCheckedChange={settings.setEditorWordWrap}
              />
            </SettingRow>
            <SettingRow label="Show Minimap">
              <Switch 
                checked={settings.editorMinimap}
                onCheckedChange={settings.setEditorMinimap}
              />
            </SettingRow>
            <SettingRow label="Show Line Numbers">
              <Switch 
                checked={settings.editorLineNumbers}
                onCheckedChange={settings.setEditorLineNumbers}
              />
            </SettingRow>
          </SettingSection>

          {/* Terminal Settings */}
          <SettingSection icon={Terminal} title="Terminal">
            <SettingRow label="Font Size">
              <SliderWithButtons
                value={settings.terminalFontSize}
                onChange={settings.setTerminalFontSize}
                min={10}
                max={24}
                suffix="px"
              />
            </SettingRow>
            <SettingRow label="Font Style">
              <Select 
                value={settings.terminalFontStyle} 
                onValueChange={settings.setTerminalFontStyle}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontStyles.map((font) => (
                    <SelectItem key={font.id} value={font.id}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingRow>
            <SettingRow label="Line Height">
              <SliderWithButtons
                value={settings.terminalLineHeight}
                onChange={settings.setTerminalLineHeight}
                min={1}
                max={2}
                step={0.1}
              />
            </SettingRow>
          </SettingSection>

          {/* Layout Settings */}
          <SettingSection icon={Layout} title="Layout">
            <SettingRow 
              label="Show Status Bar" 
              description="Display the status bar at the bottom of the editor"
            >
              <Switch 
                checked={settings.showStatusBar}
                onCheckedChange={settings.setShowStatusBar}
              />
            </SettingRow>
          </SettingSection>

          {/* Theme Selection */}
          <SettingSection icon={Palette} title="Theme">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {themes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isActive={settings.activeThemeId === theme.id}
                  onClick={() => settings.setActiveTheme(theme.id)}
                />
              ))}
            </div>
          </SettingSection>
        </div>
      </ScrollArea>
    </div>
  );
}
